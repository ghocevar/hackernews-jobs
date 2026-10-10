import type { Article } from '../interfaces/Article';

const defaultBaseURL = 'https://hacker-news.firebaseio.com';
const cacheTTLMs = 5 * 60 * 1000;
const maxWorkers = 32;
const maxResponseBytes = 4 * 1024 * 1024;
const userAgent =
  'hackernews-jobs (+https://github.com/ghocevar/hackernews-jobs)';

interface RawStory {
  by?: string;
  id?: number;
  time?: number;
  title?: string;
  type?: string;
  url?: string;
  text?: string;
}

const cached = new Map<string, { expires: number; stories: Article[] }>();
const loading = new Map<string, Promise<Article[]>>();

export async function loadJobStories(
  baseURL = defaultBaseURL
): Promise<Article[]> {
  const hit = cached.get(baseURL);
  if (hit && hit.expires > Date.now()) {
    return hit.stories;
  }
  const pending = loading.get(baseURL);
  if (pending) {
    return pending;
  }

  const run = fetchJobStories(baseURL)
    .then((stories) => {
      cached.set(baseURL, { expires: Date.now() + cacheTTLMs, stories });
      return stories;
    })
    .finally(() => {
      loading.delete(baseURL);
    });
  loading.set(baseURL, run);
  return run;
}

async function fetchJobStories(baseURL: string): Promise<Article[]> {
  const ids = await getJSON<number[]>(baseURL, '/v0/jobstories.json');
  if (!Array.isArray(ids)) {
    throw new Error('hacker news jobstories.json was not a list');
  }

  const loaded = await mapPool(ids, maxWorkers, (id) => loadStory(baseURL, id));
  const stories = loaded.filter((story): story is Article => story !== null);
  if (ids.length > 0 && stories.length === 0) {
    throw new Error(
      `hacker news returned ${ids.length} job ids but none could be loaded`
    );
  }
  return stories;
}

async function loadStory(baseURL: string, id: number): Promise<Article | null> {
  try {
    const story = await getJSON<RawStory>(baseURL, `/v0/item/${id}.json`);
    if (story.type !== 'job' || !story.id || !story.title) {
      return null;
    }
    const article: Article = {
      id: story.id,
      title: story.title,
      by: story.by ?? '',
      time: typeof story.time === 'number' ? story.time : 0,
    };
    if (story.url) {
      article.url = story.url;
    }
    if (story.text) {
      article.text = story.text;
    }
    return article;
  } catch {
    return null;
  }
}

async function getJSON<T>(baseURL: string, path: string): Promise<T> {
  const url = new URL(path, baseURL.endsWith('/') ? baseURL : `${baseURL}/`);
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': userAgent,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`hacker news ${path}: ${res.status}`);
  }
  const text = await res.text();
  if (text.length > maxResponseBytes) {
    throw new Error(`hacker news ${path}: response too large`);
  }
  return JSON.parse(text) as T;
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function run(): Promise<void> {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= items.length) {
        return;
      }
      const item = items[index];
      if (item === undefined) {
        return;
      }
      results[index] = await worker(item);
    }
  }

  const runners = Math.min(Math.max(limit, 1), Math.max(items.length, 1));
  await Promise.all(Array.from({ length: runners }, () => run()));
  return results;
}

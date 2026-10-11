import type { Article } from '../interfaces/Article';

export function jobHref(article: Pick<Article, 'id' | 'url'>): string {
  const item = `https://news.ycombinator.com/item?id=${article.id}`;
  if (!article.url) {
    return item;
  }
  let url: URL;
  try {
    url = new URL(article.url);
  } catch {
    return item;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return item;
  }
  return url.href;
}

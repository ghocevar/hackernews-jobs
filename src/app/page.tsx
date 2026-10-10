import { headers } from 'next/headers';
import ArticlesContainer from '../containers/ArticlesContainer';
import type { Article } from '../interfaces/Article';

export const dynamic = 'force-dynamic';

async function storiesURL(): Promise<string> {
  if (!process.env.VERCEL) {
    return 'http://127.0.0.1:8080/api/stories';
  }

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  if (!host) {
    throw new Error('Unable to determine the request host');
  }
  const forwarded = headerList.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwarded || 'https';
  return `${proto}://${host}/api/stories`;
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch(await storiesURL(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Unable to fetch articles');
  }
  return res.json() as Promise<Article[]>;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <>
      <p className="lede">View jobs of the most actively hiring YC companies.</p>
      <ArticlesContainer articles={articles} />
    </>
  );
}

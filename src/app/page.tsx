import ArticlesContainer from '../containers/ArticlesContainer';
import type { Article } from '../interfaces/Article';

export const dynamic = 'force-dynamic';

function apiURL(): string {
  const configured = process.env.API_URL?.trim();
  return configured ? configured : 'http://127.0.0.1:8080';
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch(apiURL(), { cache: 'no-store' });
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

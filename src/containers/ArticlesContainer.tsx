'use client';

import useSWR from 'swr';
import Article from '../components/Article';
import type { Article as ArticleType } from '../interfaces/Article';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Unable to fetch articles');
    }
    return res.json();
  });

interface ArticlesContainerProps {
  articles: ArticleType[];
}

export default function ArticlesContainer({ articles }: ArticlesContainerProps) {
  const { data, error } = useSWR<ArticleType[]>('/api/stories', fetcher, {
    fallbackData: articles,
  });

  if (error && !data) {
    throw error;
  }

  const jobs = data ?? [];
  if (jobs.length === 0) {
    return <p className="empty">No job stories right now.</p>;
  }

  return (
    <div className="jobs">
      {jobs.map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </div>
  );
}

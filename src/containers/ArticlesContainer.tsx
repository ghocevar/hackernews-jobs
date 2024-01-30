'use client';

import useSWR from 'swr';
import Article from '../components/Article';
import { Article as ArticleType } from '../interfaces/Article';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ArticlesContainerProps {
  articles: ArticleType[];
}

const ArticlesContainer: React.FC<ArticlesContainerProps> = ({ articles }) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data, error } = useSWR<ArticleType[]>(url, fetcher, {
    fallbackData: articles,
  });

  if (error) {
    throw error;
  }

  return (
    <>
      {data.map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </>
  );
};

export default ArticlesContainer;

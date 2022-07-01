import Head from 'next/head';
import useSWR from 'swr';

import Header from '../components/Header';
import Article from '../components/Article';

import fetcher from '../utils/fetcher';
import { GET_ALL_ARTICLES } from '../graphql/allArticles';
import { Suspense } from 'react';

const Home = () => {
  const { data } = useSWR(
    [
      `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
      GET_ALL_ARTICLES,
    ],
    fetcher,
    {
      suspense: true,
    }
  );

  return (
    <>
      <Head>
        <title>Hacker News Jobs</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <main data-test-id="articles-container">
          <Header />
          {data.allArticles.map(article =>
            article.url ? <Article key={article.id} {...article} /> : null
          )}
        </main>
      </Suspense>
    </>
  );
};

export default Home;
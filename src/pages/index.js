import Head from 'next/head';
import useSWR from 'swr';

import Header from '../components/Header';
import Article from '../components/Article';

import fetcher from '../utils/fetcher';
import { GET_ALL_ARTICLES } from '../graphql/allArticles';

const Home = () => {
  const { data } = useSWR(
    [
      `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
      GET_ALL_ARTICLES,
    ],
    fetcher
  );

  if (!data) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>Hacker News Jobs</title>
      </Head>
      <main data-test-id="articles-container">
        <Header />
        {data.allArticles.map(article =>
          article.url ? <Article key={article.id} {...article} /> : null
        )}
      </main>
    </>
  );
};

export default Home;

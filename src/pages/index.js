import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { request } from 'graphql-request';

import Article from '../components/Article';
import ArticlesContainerWrapper from '../styles/ArticlesContainerStyles';

import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Header from '../components/Header';

import GET_ALL_ARTICLES from '../graphql/allArticles';

export async function getServerSideProps({ req }) {
  let { host } = req.headers;
  if (
    process.env.NODE_ENV === 'development' ||
    host.includes('localhost:') ||
    host.includes('127.0.0.1:')
  )
    host = `http://${host}`;
  else host = `https://${host}`;

  const data = await request(`${host}/api/graphql`, GET_ALL_ARTICLES);
  return {
    props: {
      data,
    },
  };
}

const Index = ({ data: { allHackernewsArticles } }) => {
  const { count } = useInfiniteScroll();

  return (
    <ArticlesContainerWrapper data-test-id="articles-container">
      <Head>
        <title>Hacker News Jobs</title>
      </Head>
      <Header />
      <p className="description">
        View jobs of the most actively hiring YC companies.
      </p>
      {allHackernewsArticles.slice(0, count).map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </ArticlesContainerWrapper>
  );
};

Index.propTypes = {
  data: PropTypes.shape({
    allHackernewsArticles: PropTypes.array,
  }).isRequired,
};

export default Index;

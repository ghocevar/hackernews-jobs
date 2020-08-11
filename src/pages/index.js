import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { request } from 'graphql-request';

import Article from '../components/Article';
import ArticlesContainerWrapper from '../styles/ArticlesContainerStyles';

import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Header from '../components/Header';

import GET_ALL_ARTICLES from '../graphql/allArticles';

export async function getServerSideProps() {
  const data = await request(
    `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
    GET_ALL_ARTICLES
  );

  return {
    props: {
      data,
    },
  };
}

const Index = ({ data: { allArticles } }) => {
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
      {allArticles.slice(0, count).map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </ArticlesContainerWrapper>
  );
};

Index.propTypes = {
  data: PropTypes.shape({
    allArticles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
        by: PropTypes.string,
        time: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default Index;

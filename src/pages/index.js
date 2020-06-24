import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { request } from 'graphql-request';

import Story from '../components/Story';
import StoriesContainerWrapper from '../styles/StoriesContainerStyles';

import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Header from '../components/Header';

import GET_ALL_ARTICLES from '../graphql/allArticles';

export async function getServerSideProps(req) {
  const origin = req.req.headers.referer;
  const data = await request(`${origin}api/graphql`, GET_ALL_ARTICLES);
  return {
    props: {
      data,
    },
  };
}

const Index = ({ data: { allHackernewsArticles } }) => {
  const { count } = useInfiniteScroll();

  return (
    <StoriesContainerWrapper data-test-id="stories-container">
      <Head>
        <title>Jobs | Hacker News</title>
      </Head>
      <Header />
      <p className="description">
        View jobs of the most actively hiring YC companies.
      </p>
      {allHackernewsArticles.slice(0, count).map((article) => (
        <Story key={article.id} {...article} />
      ))}
    </StoriesContainerWrapper>
  );
};

Index.propTypes = {
  data: PropTypes.shape({
    allHackernewsArticles: PropTypes.array,
  }).isRequired,
};

export default Index;

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Story from '../components/Story';
import StoriesContainerWrapper from '../styles/StoriesContainerStyles';

import { jobsUrl } from '../services/hnApi';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Header from '../components/Header';

export async function getServerSideProps() {
  const res = await fetch(jobsUrl);
  const storyIds = await res.json();

  return { props: { storyIds } };
}

const Index = ({ storyIds }) => {
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
      {storyIds.slice(0, count).map((storyId) => (
        <Story key={storyId} storyId={storyId} />
      ))}
    </StoriesContainerWrapper>
  );
};

Index.propTypes = {
  storyIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Index;

import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

import Header from '../components/Header';
import Article from '../components/Article';
import ArticlesContainerWrapper from '../styles/ArticlesContainerStyles';

// import useInfiniteScroll from '../hooks/useInfiniteScroll';

import fetcher from '../utils/fetcher';
import GET_ALL_ARTICLES from '../graphql/allArticles';

export async function getStaticProps() {
  const articles = await fetcher(
    `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
    GET_ALL_ARTICLES
  );

  return {
    revalidate: 60 * 60 * 3,
    props: {
      articles,
    },
  };
}

const Home = ({ articles }) => {
  let { allArticles } = articles;
  // const { count } = useInfiniteScroll();
  const { data } = useSWR(
    [
      `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
      GET_ALL_ARTICLES,
    ],
    fetcher,
    { initialData: articles }
  );

  if (
    data &&
    JSON.stringify(data.allArticles) !== JSON.stringify(articles.allArticles)
  ) {
    allArticles = data.allArticles;
  }

  return (
    <ArticlesContainerWrapper data-test-id="articles-container">
      <Header />
      <p className="description">
        View jobs of the most actively hiring YC companies.
      </p>
      {allArticles
        // .slice(0, count)
        .map((article) =>
          article.url ? <Article key={article.id} {...article} /> : null
        )}
    </ArticlesContainerWrapper>
  );
};

Home.propTypes = {
  articles: PropTypes.shape({
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

export default Home;

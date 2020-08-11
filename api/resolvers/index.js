export default {
  Query: {
    allArticles: (_, __, { dataSources }) =>
      dataSources.hackernews.getAllArticles(),
  },
};

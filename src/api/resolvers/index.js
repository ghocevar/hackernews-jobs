export default {
  Query: {
    allHackernewsArticles: (_, __, { dataSources }) =>
      dataSources.hackernews.getAllArticles(),
  },
};

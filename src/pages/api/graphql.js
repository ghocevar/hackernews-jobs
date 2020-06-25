import { ApolloServer } from 'apollo-server-micro';

import typeDefs from './_typedefs';
import resolvers from './_resolvers';
import HackerNewsAPI from './_datasources/hnApi';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    hackernews: new HackerNewsAPI(),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler({ path: '/api/graphql' });

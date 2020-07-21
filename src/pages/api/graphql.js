/* eslint-disable import/no-unresolved */
import { ApolloServer } from 'apollo-server-micro';

import typeDefs from '@/api/typedefs';
import resolvers from '@/api/resolvers';
import HackerNewsAPI from '@/api/datasources/hnApi';

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

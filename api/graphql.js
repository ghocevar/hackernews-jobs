import { ApolloServer } from 'apollo-server-lambda';

import typeDefs from './typedefs';
import resolvers from './resolvers';
import HackerNewsAPI from './datasources/hnApi';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ hackernews: new HackerNewsAPI() }),
});

exports.graphqlHandler = server.createHandler();

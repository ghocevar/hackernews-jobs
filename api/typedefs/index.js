import { gql } from 'apollo-server-lambda';

export default gql`
  type Query {
    allArticles: [Article!]!
  }

  type Article {
    id: ID!
    title: String
    by: String
    url: String
    time: String
  }
`;

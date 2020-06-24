import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    allHackernewsArticles: [Article!]!
  }

  type Article {
    id: ID!
    title: String
    by: String
    url: String
    time: String
  }
`;

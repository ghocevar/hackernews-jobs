import { gql } from 'graphql-request';

export const GET_ALL_ARTICLES = gql`
  {
    allArticles {
      id
      title
      url
      by
      time
    }
  }
`;

import { gql } from 'graphql-request';

export default gql`
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

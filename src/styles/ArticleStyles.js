import styled from 'styled-components';

export const ArticleWrapper = styled.section`
  padding-top: 10px;
  margin-bottom: 20px;
  border-top: 1px solid #cccccc;

  &:first-of-type {
    border-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const ArticleTitle = styled.h1`
  margin-bottom: 5px;
  font-size: 18px;
  line-height: 1.8;
  margin: 0;
  text-decoration: none;

  a {
    color: ${(props) => props.theme.colors.blue};
    text-decoration: none;
  }
`;

export const ArticleMeta = styled.div`
  font-style: italic;

  > span:not(:first-child):before {
    content: '•';
    margin: 0 7px;
  }

  .article__meta-bold {
    font-weight: ${(props) => props.theme.fontWeights.bold};
  }
`;

export const ArticleMetaElement = styled.span`
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${(props) => props.theme.colors.black};
`;

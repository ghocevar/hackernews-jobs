import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  ArticleWrapper,
  ArticleTitle,
  ArticleMeta,
  ArticleMetaElement,
} from '../styles/ArticleStyles';
import mapTime from '../utils/mapTime';

const Article = memo(function Article({ title, url, by, time }) {
  return url ? (
    <ArticleWrapper>
      <ArticleTitle>
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      </ArticleTitle>

      <ArticleMeta>
        <span className="article__by" data-testid="article-by">
          <ArticleMetaElement>By: </ArticleMetaElement>
          {by}
        </span>

        <span className="article__time" data-testid="article-time">
          <ArticleMetaElement>Posted: </ArticleMetaElement>
          {mapTime(time)} ago
        </span>
      </ArticleMeta>
    </ArticleWrapper>
  ) : null;
});

Article.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default Article;

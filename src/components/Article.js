import { memo } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';

import {
  ArticleWrapper,
  ArticleTitle,
  ArticleMeta,
  ArticleMetaElement,
} from '../styles/ArticleStyles';

const Article = ({ title, url, by, time }) => {
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
          {formatDistanceToNowStrict(fromUnixTime(time))} ago
        </span>
      </ArticleMeta>
    </ArticleWrapper>
  ) : null;
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default memo(Article);

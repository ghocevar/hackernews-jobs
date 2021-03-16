import { memo } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';

const Article = ({ title, url, by, time }) => {
  return url ? (
    <article>
      <div>
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      </div>

      <div>
        <span data-testid="article-by">
          <span>By: </span>
          {by}
        </span>

        <span data-testid="article-time">
          <span>Posted: </span>
          {formatDistanceToNowStrict(fromUnixTime(time))} ago
        </span>
      </div>
    </article>
  ) : null;
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default memo(Article);

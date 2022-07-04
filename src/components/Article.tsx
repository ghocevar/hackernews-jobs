import { memo } from 'react';
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';

interface ArticleProps {
  title: string;
  url: string;
  by: string;
  time: number;
}

const Article: React.FC<ArticleProps> = ({ title, url, by, time }) => {
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

export default memo(Article);
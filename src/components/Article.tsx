import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import type { Article as ArticleType } from '../interfaces/Article';
import { jobHref } from '../lib/jobs';
import { plainText } from '../lib/plainText';

const excerptLength = 280;

function excerpt(text: string): string {
  const plain = plainText(text);
  if (plain.length <= excerptLength) {
    return plain;
  }
  return `${plain.slice(0, excerptLength - 1).trimEnd()}…`;
}

export default function Article({
  id,
  title,
  url,
  by,
  time,
  text,
}: ArticleType) {
  const href = jobHref({ id, url });
  const summary = text ? excerpt(text) : '';
  const posted = formatDistanceToNowStrict(fromUnixTime(time));

  return (
    <article className="job">
      <h2>
        <a href={href} target="_blank" rel="noreferrer noopener">
          {title}
        </a>
      </h2>
      <p className="meta">
        <span data-testid="article-by">By {by}</span>
        <time
          data-testid="article-time"
          dateTime={new Date(time * 1000).toISOString()}
          suppressHydrationWarning
        >
          Posted {posted} ago
        </time>
      </p>
      {summary ? <p className="excerpt">{summary}</p> : null}
    </article>
  );
}

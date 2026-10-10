import type { Article } from '../interfaces/Article';

export function jobHref(article: Pick<Article, 'id' | 'url'>): string {
  if (article.url) {
    return article.url;
  }
  return `https://news.ycombinator.com/item?id=${article.id}`;
}

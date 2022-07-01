import { request } from 'graphql-request';

const fetcher = (url: string, query: string) =>
  request(url, query).then(res => res);

export default fetcher;

import { request } from 'graphql-request';

const fetcher = (url, query) => request(url, query).then((res) => res);

export default fetcher;

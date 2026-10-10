# hackernews-jobs

Lists the official Hacker News job stories: the YC hiring posts from [`jobstories.json`](https://hacker-news.firebaseio.com/v0/jobstories.json). The Next.js app renders that list. A small Go API reads the stories, including posts that have text and no URL.

This branch runs locally. Cloud Run and the Terraform config are gone. Deploying the site and the API together on Vercel comes next.

## Toolchain

| Tool | Version |
| --- | --- |
| Node.js | 24.21.0 (Active LTS) |
| pnpm | 10.33.4 |
| Go | 1.27.2 |
| Next.js | 16.4.0 |
| React | 19.3.0 |
| TypeScript | 7.0.2 |

## Running locally

No environment variables are required.

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the Go API on port 8080 and the Next.js app on port 3000. Open [http://localhost:3000](http://localhost:3000).

Optional: set `API_URL` if the server should read jobs from somewhere other than `http://127.0.0.1:8080`. Set `NEXT_PUBLIC_API_URL` only if the browser should refetch that URL itself. Leave both unset for the default local app.

## Checks

```bash
pnpm test
pnpm build
```

`pnpm test` runs the Go API tests. `pnpm build` builds the Next.js app. GitHub Actions runs both.

### Previous version

Originally this project followed a [Hacker News clone tutorial](https://www.youtube.com/watch?v=7DLRJj1YjvQ&t=7044s) by Karl Hadwen, with a Serverless Framework GraphQL API. That code is on the [master branch](https://github.com/ghocevar/hackernews-jobs/tree/master).

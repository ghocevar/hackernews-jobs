# hackernews-jobs

Lists the official Hacker News job stories: the YC hiring posts from [`jobstories.json`](https://hacker-news.firebaseio.com/v0/jobstories.json). The Next.js app and the Go API deploy as one Vercel project. The page server-renders `/api/stories` on the same origin. The browser does not refetch the list.

## Toolchain

| Tool | Version |
| --- | --- |
| Node.js | 24.21.0 (Active LTS) |
| pnpm | 12.11.2 |
| Go | 1.27.2 |
| Next.js | 16.4.0 |
| React | 19.3.0 |
| TypeScript | 7.0.2 |

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm format
pnpm format:check
pnpm build
pnpm start
```

`pnpm dev` starts the Go API on port 8080 and Next.js on port 3000. No environment variables are required. Open [http://localhost:3000](http://localhost:3000). The first response already contains the job list. `pnpm test` runs the Go tests and the job-list tests. `pnpm lint` and `pnpm format:check` must pass before a change is done. `pnpm build` builds the Next.js app. `pnpm start` serves that build and, off Vercel, still expects the API on port 8080.

The API remembers the list for 5 minutes. A repeat view does not read every Firebase item again. GitHub Actions runs test, lint, format:check, and build.

## Deploying to Vercel

One project serves the website and the API. The site calls `/api/stories`. There is no Cloud Run service and no API URL to configure.

**Environment variables:** none. Do not add `API_URL`, `NEXT_PUBLIC_API_URL`, or any Cloud Run setting. Vercel sets `VERCEL` itself; you do not add it.

`vercel.json` pins the framework preset to Next.js. The Go function is `api/stories/index.go`, which Vercel publishes at `/api/stories`. `go.mod` is at the repository root and pins Go 1.27.2. Vercel reads that version and downloads the toolchain the first time it sees it.

These steps happen in the Vercel dashboard. This repository does not deploy or create a project for you.

1. **Import the project.** In Vercel, choose Add New → Project and import `ghocevar/hackernews-jobs` from GitHub. Install the Vercel GitHub app on the repository if it asks.
2. **Framework preset: Next.js.** If the importer suggests Go because `go.mod` is at the root, change the preset to Next.js before deploying.
3. **Root directory: the repository root.** Leave it as `./`. Do not set it to `api`.
4. **Build settings: leave the defaults.** Install command is `pnpm install` (from the `packageManager` field). Build command is `next build`. Do not set an output directory.
5. **Production branch: `main`.** Set that only after this stack has merged to `main`. Until then, open a preview deployment of the branch you want to try. Do not point production at an unmerged stacked branch unless you intend to.
6. **Environment variables: add none.**
7. Click **Deploy**.

The first Go build can take longer while Vercel fetches Go 1.27.2. Later deployments reuse that toolchain.

### Previous version

Originally this project followed a [Hacker News clone tutorial](https://www.youtube.com/watch?v=7DLRJj1YjvQ&t=7044s) by Karl Hadwen, with a Serverless Framework GraphQL API. That code is on the [master branch](https://github.com/ghocevar/hackernews-jobs/tree/master).

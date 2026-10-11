# hackernews-jobs

Lists the official Hacker News job stories: the YC hiring posts from [`jobstories.json`](https://hacker-news.firebaseio.com/v0/jobstories.json). The Next.js page server-renders that list from Firebase and keeps it for five minutes. The browser does not refetch the list.

## Toolchain

| Tool | Version |
| --- | --- |
| Node.js | 24.21.0 (Active LTS) |
| pnpm | 12.11.2 |
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

`pnpm dev` starts Next.js on port 3000. No environment variables are required. Open [http://localhost:3000](http://localhost:3000). The first response already contains the job list. `pnpm test` runs the job-list tests. `pnpm lint` and `pnpm format:check` must pass before a change is done. `pnpm build` builds the Next.js app. `pnpm start` serves that build.

Each Firebase response is kept for 5 minutes, including after a new server process starts. A repeat view does not download every job again. If a refresh fails, the last complete list stays up. An incomplete load is not saved. GitHub Actions runs test, lint, format:check, build, and a homepage smoke test against that commit's deployment.

## Deploying to Vercel

One Vercel project serves the website. The page reads Firebase while it renders. There is no separate API and no environment variables to configure.

`vercel.json` pins the framework preset to Next.js.

These steps happen in the Vercel dashboard. This repository does not deploy or create a project for you.

1. **Import the project.** In Vercel, choose Add New → Project and import `ghocevar/hackernews-jobs` from GitHub. Install the Vercel GitHub app on the repository if it asks.
2. **Framework preset: Next.js.**
3. **Root directory: the repository root.** Leave it as `./`.
4. **Build settings: leave the defaults.** Install command is `pnpm install` (from the `packageManager` field). Build command is `next build`. Do not set an output directory.
5. **Production branch: `main`.**
6. **Environment variables: add none.**
7. Click **Deploy**.

### Previous version

Originally this project followed a [Hacker News clone tutorial](https://www.youtube.com/watch?v=7DLRJj1YjvQ&t=7044s) by Karl Hadwen, with a Serverless Framework GraphQL API. That code is on the [master branch](https://github.com/ghocevar/hackernews-jobs/tree/master).

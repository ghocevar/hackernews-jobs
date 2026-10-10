# hackernews-jobs

Official Hacker News job stories from `jobstories.json`. Next.js server-renders them from the Go API at `/api/stories`. Do not switch the product to the monthly "Ask HN: Who is hiring?" thread.

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

Toolchain: Node.js 24.21.0, pnpm 12.11.2, Go 1.27.2, Next.js 16.4.0, React 19.3.0, TypeScript 7.0.2. Biome lints and formats the TypeScript. `gofmt` covers Go. `eslint-config-next` cannot load TypeScript 7, so ESLint is not the linter.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

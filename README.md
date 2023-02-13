# hackernews-jobs

This is simple Full-stack application that uses Next.js on the frontend and Golang on the backend side. Backend fetches job stories from Hacker News API, and creates simple API endpoint to fetch job postings. 

Next.js app is deployed on Vercel and Golang backend app on the Cloud Run.

## TODO

There are some tasks in want to complete, to imporove the performace especially on the backend and data fetching.

- [ ] Create CI/CD pipelint with GitHub Actions
- [ ] Add Redis (or some cache store) and to store job postings for faster API response times
- [ ] Redesign frontend application
- [ ] Add Vercel provider to Terraform

##### Folder structure

```bash
hackernews-jobs/
├── api        # API Server in Go
├── public     # Public files used on the frontend
├── src        # Next.js frontend application
```

## Running Locally

You can checkout project locally by cloning the repo:

```bash
git clone https://github.com/ghocevar/hackernews-jobs.git
cd hackernews-jobs
echo 'API_URL="https://hackernews-jobs-api-main-cfoxkmtliq-oc.a.run.app"' > .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Previous version

Originaly, this project was built following tutorial by [Karl Hawden](https://github.com/karlhadwen) building [Hackernews Clone](https://www.youtube.com/watch?v=7DLRJj1YjvQ&t=7044s) with some minimal modifications, like use of Next.js. Backend was built with [Serverless Framework](https://serverless.com) to run Apollo GraphQL Server on AWS Lambda. You can see the code on the [master branch](https://github.com/ghocevar/hackernews-jobs/tree/master).

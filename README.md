# hackernews-jobs

Following tutorial by [Karl Hawden](https://github.com/karlhadwen) building [Hackernews Clone](https://www.youtube.com/watch?v=7DLRJj1YjvQ&t=7044s) and adding some personal modifications to it.

This is a [hackernews-jobs](https://hackernews-jobs.vercel.app/) project bootstrapped with React, Next.js and Styled Components. App is deployed via [Vercel Platform](https://vercel.com/).

##### Folder structure

```bash
hackernews-jobs/
├── api        # API Server
├── public     # Public files used on the frontend
├── src        # Frontend SPA
```

## Running Locally

You can checkout project locally by cloning the repo:

```bash
git clone https://github.com/ghocevar/hackernews-jobs.git
cd hackernews-jobs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##### API Server

Using [Serverless Framework](https://serverless.com) to run Apollo GraphQL Server on AWS Lambda. Server fetches Hackernews API and make GraphQL endpoint to use it on the frontend.

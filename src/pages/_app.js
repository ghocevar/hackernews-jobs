/* eslint-disable react/prop-types */
import Head from 'next/head';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Hacker News Jobs</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;

import { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';

const App = ({ Component, pageProps }: AppProps) => (
  <ErrorBoundary fallback={<h2>Sorry, something went wrong.</h2>}>
    <Component {...pageProps} />
  </ErrorBoundary>
);

export default App;

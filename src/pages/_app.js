/* eslint-disable react/prop-types */

import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../styles/theme';
import GlobalStyle from '../styles/globalStyles';

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;

// eslint-disable-next-line no-unused-vars
import styled, { createGlobalStyle, css } from 'styled-components';

const GlobalStyle = createGlobalStyle`${css`
  html {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    line-height: 1;
    color: #202020;
    background-color: ${({ theme }) => theme.colors.background};
    font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
  }

  ul {
    margin: 0;
    padding: 0;
  }
`}`;

export default GlobalStyle;

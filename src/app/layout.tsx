import React from 'react';
import Header from '../components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="View jobs of the most actively hiring YC companies."
      />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>Hacker News Jobs</title>
    </head>
    <body>
      <Header />
      {children}
    </body>
  </html>
);

export default Layout;

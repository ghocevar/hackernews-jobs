import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '../components/Header';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Hacker News Jobs',
  description: 'View jobs of the most actively hiring YC companies.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}

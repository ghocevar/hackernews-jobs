import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Hacker News Jobs",
  description: "View jobs of the most actively hiring YC companies.",
};

type RootLayoutProps = PropsWithChildren;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

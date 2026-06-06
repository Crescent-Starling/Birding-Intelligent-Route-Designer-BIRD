import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIRD Twitcher Mode",
  description: "Decision-first birding workbench for rare-bird chasing."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


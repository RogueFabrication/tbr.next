import "./globals.css";
import Nav from "../components/Nav";
import type { Metadata } from "next";
import { getSiteUrl } from "../lib/site";

// Single source of truth for page metadata (no static `metadata` export).
export const generateMetadata = async (): Promise<Metadata> => {
  const origin = getSiteUrl();
  return {
    title: "TBR",
    metadataBase: new URL(origin),
  };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

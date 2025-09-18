import "./globals.css";
import Nav from "../components/Nav";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://www.tubebenderreviews.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TubeBenderReviews", template: "%s | TBR" },
  description:
    "Expert reviews and transparent scoring to help you choose the perfect tube bender.",
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

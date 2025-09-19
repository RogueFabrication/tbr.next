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
        {/* TEMP NOTICE: live data is placeholder; compare/reviews may be inaccurate. Remove when real data lands. */}
        <div
          role="alert"
          className="w-full bg-red-600 text-white text-center text-sm sm:text-base font-semibold py-2 px-3"
        >
          TEMP DATA — COME BACK LATER. This site is in placeholder mode; specs/compare may be inaccurate.
        </div>
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

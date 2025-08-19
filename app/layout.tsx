import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { ReactNode } from "react";

export function LayoutMain({
  children,
  tall = false,
}: {
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <main
      className={[
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-24",
        tall ? "min-h-[120vh]" : "",
      ].join(" ")}
    >
      {children}
    </main>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <LayoutMain>{children}</LayoutMain>
        <Footer />
      </body>
    </html>
  );
}

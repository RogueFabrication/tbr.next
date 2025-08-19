"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm
                 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                 dark:hover:bg-gray-800"
      aria-pressed={isDark}
      title="Toggle dark mode"
    >
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}

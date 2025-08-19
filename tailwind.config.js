/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Layout classes
    "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400", "bg-gray-500", "bg-gray-600", "bg-gray-700", "bg-gray-800", "bg-gray-900",
    "text-gray-50", "text-gray-100", "text-gray-200", "text-gray-300", "text-gray-400", "text-gray-500", "text-gray-600", "text-gray-700", "text-gray-800", "text-gray-900",
    // Header/footer utilities
    "h-14", "h-16", "h-20",
    "px-4", "px-6", "px-8",
    "py-4", "py-6", "py-8",
    "mx-auto", "max-w-6xl", "w-full",
    "flex", "items-center", "justify-between", "justify-center",
    "border-t", "border-b",
    "mt-8", "mb-8",
    "rounded-md", "p-3", "mb-4",
    "text-sm", "gap-4", "min-w-0", "underline", "hover:underline"
  ],
  theme: { extend: {} },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  // v4 ignores `content` with Next, but safelist still works and is harmless
  safelist: [
    "bg-gray-50","text-gray-900","bg-white","bg-gray-900","text-white",
    "border","rounded-md","p-4","px-4","py-2","mb-4","mx-auto","max-w-3xl","min-h-screen"
  ],
  theme: { extend: {} },
  plugins: [],
};

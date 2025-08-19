// app/theme-script.tsx
export default function ThemeScript() {
    // Inline, no "use client" — runs before React renders
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
  (function () {
    try {
      var ls = localStorage.getItem('theme');
      var mql = window.matchMedia('(prefers-color-scheme: dark)');
      var theme = ls ? ls : (mql.matches ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (_) {}
  })();
  `,
        }}
      />
    );
  }

  

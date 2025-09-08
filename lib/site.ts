/**
 * Site helpers: build absolute URLs from env, with a dev fallback.
 */
export function getSiteUrl(): string {
  // Prefer explicit public URL if provided (Vercel/Prod).
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.endsWith("/") ? env : `${env}/`;
  // Local dev default
  return "http://localhost:3000/";
}

/**
 * Make an absolute URL by resolving `path` against the site URL.
 * Accepts paths with or without a leading slash.
 */
export function absoluteUrl(path: string): string {
  try {
    const base = getSiteUrl();
    // Ensure a single leading slash for paths
    const p = path.startsWith("/") ? path : `/${path}`;
    return new URL(p, base).toString();
  } catch {
    // Extremely defensive fallback for odd inputs
    return path;
  }
}

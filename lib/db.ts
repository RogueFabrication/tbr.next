// lib/db.ts
//
// Minimal Neon-compatible SQL helper using `postgres` (porsager).
// Exports `sql` used by repo files like benderOverlayRepo.ts.

import postgres, { type Sql } from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __tbr_sql__: Sql | undefined;
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL env var");
}

// Reuse a single client in dev/hot-reload to avoid connection storms.
export const sql: Sql =
  globalThis.__tbr_sql__ ??
  postgres(DATABASE_URL, {
    // Good defaults for serverless/Next routes:
    // Keep connections low and let the driver queue.
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__tbr_sql__ = sql;
}

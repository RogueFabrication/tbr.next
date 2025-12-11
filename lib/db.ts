import { neon } from "@neondatabase/serverless";

/**
 * Thin Neon client wrapper.
 *
 * We keep this in its own module so we have a single place that:
 * - Reads DATABASE_URL
 * - Throws loudly if it's missing in server environments
 * - Can be swapped out later if we change PG client
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Neon-backed features (overlay scoring/admin) require this environment variable.",
  );
}

// `sql` is a tagged-template query helper, e.g.:
//   const rows = await sql`SELECT * FROM bender_overlays`;
export const sql = neon(connectionString);


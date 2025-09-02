import AdminClient from "./_client/AdminClient";

export const metadata = { title: "Admin | TBR" };

export default function AdminPage() {
  // Accept several truthy values so flip works reliably.
  const flag = (process.env.NEXT_PUBLIC_ENABLE_ADMIN ?? "").toLowerCase().trim();
  const enabled = flag === "true" || flag === "1" || flag === "yes";
  const onVercel = process.env.VERCEL === "1";

  if (!enabled || onVercel) {
    return (
      <div className="mx-auto max-w-3xl p-6 space-y-3">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Admin is disabled. Enable locally by setting{" "}
          <code className="px-1 rounded bg-muted">NEXT_PUBLIC_ENABLE_ADMIN=true</code> in
          <code className="px-1 rounded bg-muted">.env.local</code> and restarting the dev server.
        </p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground">
          <li>Writes are always blocked on Vercel (preview/prod).</li>
          <li>Local edits update an in-memory overlay only (reset on restart).</li>
        </ul>
        {/* Debug hint (no secrets): shows what the server actually sees */}
        <pre className="text-xs text-muted-foreground">
          {JSON.stringify(
            { flag, enabled, onVercel: process.env.VERCEL ?? "0" },
            null,
            2
          )}
        </pre>
      </div>
    );
  }
  return <AdminClient />;
}

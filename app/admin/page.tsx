// app/admin/page.tsx
export const metadata = { title: "Admin | TBR" };

// NOTE: This is a *server* component (no "use client") so it can read envs.
import AdminClient from "./_client/AdminClient";

export default function Page() {
  const enabled =
    process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true" ||
    process.env.NODE_ENV !== "production";

  if (!enabled) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6">
        <h1 className="text-xl font-semibold mb-2">Admin</h1>
        <p className="text-sm text-gray-600 mb-4">
          The admin panel is disabled for production. Enable locally with
          <code className="ml-1">NEXT_PUBLIC_ENABLE_ADMIN=true</code>.
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>No database writes.</li>
          <li>No credentials or env variables required.</li>
          <li>Safe to deploy.</li>
        </ul>
      </div>
    );
  }

  return <AdminClient />;
}

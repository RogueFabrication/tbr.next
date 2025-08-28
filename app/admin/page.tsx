import AdminTabs from '../../components/admin/AdminTabs';

export const metadata = {
  title: 'Admin | TubeBenderReviews',
};

/**
 * /admin page (rescue stub)
 * Server component that renders a lightweight client stub.
 */
export default function AdminPage() {
  return (
    <main className="p-6">
      <AdminTabs />
    </main>
  );
}

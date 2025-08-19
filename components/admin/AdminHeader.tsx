'use client';

export function AdminHeader() {
  const handleLogout = () => {
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/admin/login';
  };

  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage products, content, and site configuration
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Environment: {process.env.NODE_ENV}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


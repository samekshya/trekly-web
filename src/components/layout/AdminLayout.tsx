import React from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Trekly Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700">
            Manage Users
          </Link>
          <Link href="/admin/treks" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700">
            Manage Treks
          </Link>
          <button className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-700 mt-10">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

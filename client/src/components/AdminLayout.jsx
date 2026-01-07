// src/components/AdminLayout.jsx
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-100 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin/books" className="hover:text-teal-100">Books</Link>
          <Link to="/admin/clubs" className="hover:text-teal-200">Clubs</Link>
          <Link to="/admin/borrow-history" className="hover:text-teal-200">Borrow History</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-teal-50">{children}</main>
    </div>
  );
}

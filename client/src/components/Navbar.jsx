// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-teal-300 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-semibold tracking-tight hover:text-teal-100 transition"
      >
        BookVerse
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {/* Show Books & Clubs only for non-admin users */}
        {!user?.isAdmin && (
          <>
            <Link
              to="/books"
              className="hover:text-teal-100 transition font-medium"
            >
              Books
            </Link>

            <Link
              to="/clubs"
              className="hover:text-teal-100 transition font-medium"
            >
              Clubs
            </Link>
          </>
        )}

        {user ? (
          <>
            <Link
              to="/profile"
              className="text-sm text-teal-100 hidden sm:inline hover:underline transition"
            >
              {user.name}
            </Link>

            <button
              onClick={logout}
              className="bg-white text-teal-600 px-4 py-1.5 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="border border-white px-4 py-1.5 rounded-lg font-medium hover:bg-white hover:text-teal-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

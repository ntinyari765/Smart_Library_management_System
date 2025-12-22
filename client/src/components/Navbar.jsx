// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Logged out", "success");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-semibold tracking-tight !text-white !hover:text-teal-100 transition"
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
              className="!text-white !hover:text-teal-100 transition font-medium"
            >
              Books
            </Link>

            <Link
              to="/clubs"
              className="!text-white !hover:text-teal-100 transition font-medium"
            >
              Clubs
            </Link>
          </>
        )}

        {user ? (
          <>
            <Link
              to="/profile"
              className="text-sm !text-white hidden sm:inline !hover:underline transition"
            >
              {user.name}
            </Link>

            <button
              onClick={handleLogout}
              className="bg-white text-teal-600 px-4 py-1.5 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="border border-white !text-white px-4 py-1.5 rounded-lg font-medium hover:bg-white hover:text-teal-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

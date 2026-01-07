// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminClubs from "./pages/admin/AdminClubs";
import MyBorrowedBooks from "./pages/MyBorrowedBooks";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/books" element={<Books />} />
      <Route path="/cart" element={<Cart />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <Clubs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clubs/:id"
        element={
          <ProtectedRoute>
            <ClubDetails />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/books"
        element={
          <AdminRoute>
            <AdminBooks />
          </AdminRoute>
        }
      />

      <Route
        path="/borrowed"
        element={
          <ProtectedRoute>
            <MyBorrowedBooks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/clubs"
        element={
          <AdminRoute>
            <AdminClubs />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

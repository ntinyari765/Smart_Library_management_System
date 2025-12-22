import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or a spinner

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    // If logged in but not an admin, redirect to home
    return <Navigate to="/" />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or a spinner

  if (!user || !user.isAdmin) {
    // If not logged in or not admin, redirect to home
    return <Navigate to="/" />;
  }

  return children;
}

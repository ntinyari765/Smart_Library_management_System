import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await API.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);

      // Set user immediately
      setUser(res.data.user);
      // Return user for redirect logic
      return res.data.user;
    } catch (error) {
      throw error;
    }
  };

  // Load user on refresh / initial load
  const loadUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

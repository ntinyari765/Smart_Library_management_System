import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login({ email, password });

      // Show success toast
      showToast("Welcome back!", "success");

      // Use returned user to avoid race condition with context state
      if (loggedInUser?.role === "admin" || loggedInUser?.isAdmin) {
        navigate("/admin/books");
      } else {
        navigate("/books");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login failed";
      showToast(msg, "error");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-bold text-teal-700 text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Login to your BookVerse account
        </p>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-teal-600 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition"
          >
            Login
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

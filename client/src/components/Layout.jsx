// src/components/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-teal-50">
      {/* Navbar always on top */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-teal-700 text-teal-100 text-center py-4">
        © {new Date().getFullYear()} BookVerse. All rights reserved.
      </footer>
    </div>
  );
}

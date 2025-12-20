// src/pages/Books.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { useCart } from "../context/CartContext";
import Layout from "../components/Layout";

export default function Books() {
  const [books, setBooks] = useState([]);
  const { cart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-teal-800">
            Available Books
          </h1>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/cart"
              className="bg-gradient-to-br from-teal-200 to-teal-100 text-white px-5 py-2 rounded-full font-semibold hover:from-teal-200 hover:to-teal-100 transition"
            >
              View Cart ({cart.length})
            </Link>

            <Link
              to="/clubs"
              className="bg-gradient-to-br from-teal-200 to-teal-100 text-white px-5 py-2 rounded-full font-semibold hover:from-teal-200 hover:to-teal-100 transition"
            >
              Join a Book Club
            </Link>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No books available
            </p>
          ) : (
            books.map((book) => <BookCard key={book._id} book={book} />)
          )}
        </div>
      </div>
    </Layout>
  );
}

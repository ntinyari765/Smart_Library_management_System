import { useState } from "react";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import { useToast } from "../context/ToastContext"; // optional, for notifications
import { useNavigate } from "react-router-dom";

const BookCard = ({ book, userId, refreshBooks }) => {
  // Defensive: sometimes API returns items with missing book payloads (e.g., borrowed list). Avoid crashing.
  if (!book) return null;

  const { cart, addToCart } = useCart();
  const inCart = cart.find((item) => item._id === book._id);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Normalize borrowedBy to an id string for comparisons
  const borrowedById = book.borrowedBy && book.borrowedBy._id ? book.borrowedBy._id : book.borrowedBy;

  /* Borrow / Return handlers */
  const handleBorrow = async () => {
    try {
      setLoading(true);
      await API.post(`/books/${book._id}/borrow`);
      showToast("Book borrowed successfully!", "success");
      refreshBooks();
    } catch (err) {
      const msg = err.response?.data?.message || "Error borrowing book";
      if (err.response?.status === 401) {
        showToast("Please login to borrow a book", "error");
        navigate('/login');
      } else {
        showToast(msg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    try {
      setLoading(true);
      await API.post(`/books/${book._id}/return`);
      showToast("Book returned successfully!", "success");
      refreshBooks();
    } catch (err) {
      const msg = err.response?.data?.message || "Error returning book";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden flex flex-col border rounded shadow-md">
      <img
        src={book.coverImage || "https://via.placeholder.com/200x250?text=No+Image"}
        loading="lazy"
        alt={book.title}
        className="w-full h-60 object-cover bg-gray-100"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-teal-800 mb-1">{book.title}</h2>
        <p className="text-teal-700 text-sm mb-2">Author: {book.author}</p>
        <p className="text-teal-600 font-semibold mb-2">${(typeof book.price === 'number' ? book.price : 0).toFixed(2)}</p>
        <p className="text-gray-500 text-sm flex-1">{book.description?.substring(0, 80)}...</p>

        {/* Borrow / Return / Unavailable */}
        {book.availability ? (
          <button
            onClick={handleBorrow}
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-full bg-teal-500 text-white font-semibold hover:bg-teal-600"
          >
            Borrow
          </button>
        ) : borrowedById?.toString() === userId?.toString() ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleReturn}
              disabled={loading}
              className="px-4 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              Return
            </button>

            {/* Read button (placeholder) */}
            <a
              href={`/read/${book._id}`}
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Read
            </a>
          </div>
        ) : (
          <span className="mt-2 px-4 py-2 inline-block rounded-full bg-gray-300 text-gray-700">
            Unavailable
          </span>
        )}

        {/* Cart button */}
        <button
          onClick={() => addToCart(book)}
          className={`mt-4 btn-primary px-4 py-2 rounded-full font-semibold text-white ${
            inCart ? "opacity-60 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
          }`}
          disabled={inCart}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;

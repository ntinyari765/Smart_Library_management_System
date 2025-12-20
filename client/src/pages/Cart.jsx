// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Your Cart is Empty</h2>
          <Link
            to="/books"
            className="bg-gradient-to-br from-teal-200 to-teal-100 text-white px-6 py-3 rounded-full font-semibold hover:from-teal-200 hover:to-teal-100 transition"
          >
            Browse Books
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-teal-800 mb-6">Your Cart</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={book.coverImage || "https://via.placeholder.com/200x250?text=No+Image"}
                alt={book.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-teal-800 mb-1">{book.title}</h3>
                <p className="text-teal-700 text-sm mb-2">Author: {book.author}</p>
                <p className="text-teal-600 font-semibold mb-4">${book.price.toFixed(2)}</p>

                <button
                  onClick={() => removeFromCart(book._id)}
                  className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xl font-semibold text-teal-800">
            Total: ${totalPrice.toFixed(2)}
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={clearCart}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Clear Cart
            </button>

            <button
              className="bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
const BookCard = ({ book }) => {
  const { cart, addToCart } = useCart();
  const inCart = cart.find((item) => item._id === book._id);

  return (
    <div className="card overflow-hidden flex flex-col">
      <img
        src={book.coverImage || "https://via.placeholder.com/200x250?text=No+Image"}
        loading="lazy"
        alt={book.title}
        className="w-full h-60 object-cover bg-gray-100"
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-teal-800 mb-1">{book.title}</h2>
        <p className="text-teal-700 text-sm mb-2">Author: {book.author}</p>
        <p className="text-teal-600 font-semibold mb-2">${book.price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm flex-1">{book.description?.substring(0, 80)}...</p>

        <button
          onClick={() => addToCart(book)}
          className={`mt-4 btn-primary px-4 py-2 rounded-full font-semibold text-white ${
            inCart ? "opacity-60 cursor-not-allowed" : ""
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
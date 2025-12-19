import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a book to cart (avoid duplicates)
  const addToCart = (book) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === book._id);
      if (exists) return prevCart; // don't add duplicates
      return [...prevCart, book];
    });
  };

  // Remove a book from cart
  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
  };

  // Clear all items from cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier access
export const useCart = () => useContext(CartContext);

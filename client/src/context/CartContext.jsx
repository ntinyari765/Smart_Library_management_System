import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_local");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync cart for logged in users: fetch from server
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const res = await API.get("/users/cart");
          // res.data is array of { book: {..}, quantity }
          const items = res.data.map((it) => ({ ...it.book, quantity: it.quantity }));
          setCart(items);
        } catch (err) {
          console.error("Failed to load server cart:", err);
          // fallback to local cart
        }
      } else {
        // load from localStorage for guests
        try {
          const raw = localStorage.getItem("cart_local");
          setCart(raw ? JSON.parse(raw) : []);
        } catch (e) {
          setCart([]);
        }
      }
    };
    loadCart();
  }, [user]);

  // Persist local cart changes for guests
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem("cart_local", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, user]);

  // Add a book to cart (avoid duplicates). For logged-in users, persist to server.
  const addToCart = async (book) => {
    if (user) {
      try {
        await API.post("/users/cart", { bookId: book._id, quantity: 1 });
        const res = await API.get("/users/cart");
        const items = res.data.map((it) => ({ ...it.book, quantity: it.quantity }));
        setCart(items);
      } catch (err) {
        console.error("Failed to add to server cart:", err);
      }
    } else {
      setCart((prevCart) => {
        const exists = prevCart.find((item) => item._id === book._id);
        if (exists) return prevCart; // don't add duplicates
        return [...prevCart, { ...book, quantity: 1 }];
      });
    }
  };

  // Remove a book from cart
  const removeFromCart = async (bookId) => {
    if (user) {
      try {
        await API.delete(`/users/cart/${bookId}`);
        const res = await API.get("/users/cart");
        const items = res.data.map((it) => ({ ...it.book, quantity: it.quantity }));
        setCart(items);
      } catch (err) {
        console.error("Failed to remove from server cart:", err);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
    }
  };

  // Clear all items from cart
  const clearCart = async () => {
    if (user) {
      // No server endpoint for clearing, just remove items one by one
      try {
        const res = await API.get("/users/cart");
        for (const it of res.data) {
          await API.delete(`/users/cart/${it.book._id}`);
        }
        setCart([]);
      } catch (err) {
        console.error("Failed to clear server cart:", err);
      }
    } else {
      setCart([]);
      try {
        localStorage.removeItem("cart_local");
      } catch (e) {}
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier access
export const useCart = () => useContext(CartContext);

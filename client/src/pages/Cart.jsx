import { useEffect, useState } from "react";
import API from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const res = await API.get("/users/cart");
    setCart(res.data);
  };

  const removeFromCart = async (bookId) => {
    await API.delete(`/users/cart/${bookId}`);
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  return (
    <div>
      <h2>My Cart</h2>
      {cart.map((item) => (
        <div key={item.book._id} className="cart-item">
          <h3>{item.book.title}</h3>
          <p>Price: ${item.book.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => removeFromCart(item.book._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button>Proceed to Checkout (Future)</button>
    </div>
  );
};

export default Cart;

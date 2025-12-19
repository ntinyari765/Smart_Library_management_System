export default function CartSidebar({ cartItems }) {
  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-gray-100 p-4 shadow-lg">
      <h3 className="font-bold text-xl mb-4">Your Cart</h3>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item._id} className="mb-2 flex justify-between">
              {item.title} <span>${item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

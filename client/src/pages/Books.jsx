import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await API.get("/books");
      setBooks(res.data);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Available Books</h1>
      <Link to="/clubs">Join a Book Club</Link>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {books.map((book) => (
          <div key={book._id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <p>{book.description?.substring(0, 60)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;

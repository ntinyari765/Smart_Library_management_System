import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import BookCard from '../components/BookCard';
import { useToast } from '../context/ToastContext';

const MyBorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const { showToast } = useToast();

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axios.get('/users/borrowed-books');
      setBooks(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error fetching borrowed books', 'error');
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Borrowed Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.length > 0 ? (
          books.map((item) => (
            <BookCard
              key={item.book._id}
              book={item.book}
              userId={item.book.borrowedBy}
              refreshBooks={fetchBorrowedBooks}
            />
          ))
        ) : (
          <p>You have no borrowed books.</p>
        )}
      </div>
    </div>
  );
};

export default MyBorrowedBooks;

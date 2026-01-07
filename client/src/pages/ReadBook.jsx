import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function ReadBook() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        showToast(err.response?.data?.message || 'Error loading book', 'error');
      }
    };
    fetchBook();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reader (Coming Soon)</h1>
      {book ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
          <p className="text-sm text-gray-600 mb-4">by {book.author}</p>
          <div className="p-6 border rounded bg-white">
            <p className="text-gray-700">Reader UI is a work-in-progress — this page will let users read the book in-app.</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
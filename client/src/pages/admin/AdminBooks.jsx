// src/pages/AdminBooks.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Layout from "../../components/Layout";
import { useToast } from "../../context/ToastContext";

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    coverImage: "",
    description: "",
  });
  const { showToast } = useToast();

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/books", formData);
      showToast("Book added!", "success");
      // Prepend new book to list
      setBooks((prev) => [res.data, ...prev]);
      setFormData({ title: "", author: "", price: "", coverImage: "", description: "" });
    } catch (err) {
      console.error(err);
      showToast("Failed to add book", "error");
    }
  };

  // Edit / Delete handlers
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (book) => {
    setEditingId(book._id);
    setEditForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      coverImage: book.coverImage || "",
      description: book.description || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/books/${id}`, editForm);
      setBooks((prev) => prev.map((b) => (b._id === id ? res.data : b)));
      showToast("Book updated", "success");
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update book";
      showToast(msg, "error");
    }
  };

  const deleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await API.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      showToast("Book deleted", "success");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete book";
      showToast(msg, "error");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-teal-800">Admin Books Panel</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/clubs')}
              className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              Go to Admin Clubs
            </button>
          </div>
        </div>

        {/* Add Book Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Add New Book</h3>
          <form className="space-y-4" onSubmit={handleAddBook}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="coverImage"
              placeholder="Cover Image URL"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-teal-600 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:from-teal-700 hover:to-teal-600 transition"
            >
              Add Book
            </button>
          </form>
        </div>

        {/* Books List */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Existing Books</h3>
          {books.length === 0 ? (
            <p className="text-gray-500">No books added yet.</p>
          ) : (
            <ul className="space-y-3">
              {books.map((book) => (
                <li key={book._id} className="flex justify-between items-center border-b pb-2">
                  {editingId === book._id ? (
                    <div className="w-full flex items-start gap-4">
                      <div className="flex-1">
                        <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full p-2 border rounded mb-1" />
                        <input name="author" value={editForm.author} onChange={handleEditChange} className="w-full p-2 border rounded mb-1" />
                        <input name="price" value={editForm.price} onChange={handleEditChange} type="number" className="w-full p-2 border rounded mb-1" />
                        <input name="coverImage" value={editForm.coverImage} onChange={handleEditChange} className="w-full p-2 border rounded mb-1" />
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full p-2 border rounded" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveEdit(book._id)} className="bg-green-500 text-white px-3 py-1 rounded-lg font-medium">Save</button>
                        <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded-lg">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-gray-600 text-sm">{book.author} - ${book.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(book)} className="bg-yellow-400 px-3 py-1 rounded-lg font-medium">Edit</button>
                        <button onClick={() => deleteBook(book._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

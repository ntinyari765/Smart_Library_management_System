import Book from '../models/Book.js';

// Get all books
export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

// Get book by ID
export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) res.json(book);
  else res.status(404).json({ message: 'Book not found' });
};

// Create book (Admin only)
export const createBook = async (req, res) => {
  const { title, author, price, coverImage, description } = req.body;
  try {
    const book = await Book.create({ title, author, price, coverImage, description });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update book (Admin only)
export const updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete book (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: error.message });
  }
};

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

// Create book
export const createBook = async (req, res) => {
  const {
    title,
    author,
    genre,
    description,
    ISBN,
    coverImage,
    availability,
    rating,
    price,
    purchaseLink,
  } = req.body;

  const book = new Book({
    title,
    author,
    genre,
    description,
    ISBN,
    coverImage,
    availability,
    rating,
    price,
    purchaseLink,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
};

// Update book
export const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await book.remove();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

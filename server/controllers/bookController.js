import Book from '../models/Book.js';
import User from '../models/User.js';

/* Get all books */
export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

/* Get book by ID */
export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) res.json(book);
  else res.status(404).json({ message: 'Book not found' });
};

/* Create book (Admin only) */
export const createBook = async (req, res) => {
  const { title, author, price, coverImage, description } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      price,
      coverImage,
      description
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Update book (Admin only) */
export const updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(400).json({ message: error.message });
  }
};

/* Delete book (Admin only) */
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

/* Borrow book */
export const borrowBook = async (req, res) => {
  try {
    // req.user should come from protect middleware
    const userId = req.user; 

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (!book.availability) return res.status(400).json({ message: "Book not available" });

    book.availability = false;
    book.borrowedBy = userId;
    book.borrowedAt = new Date();
    // Record book-level borrow history
    book.borrowHistory.push({ user: userId, borrowedAt: book.borrowedAt });
    await book.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add to user's borrowedBooks
    user.borrowedBooks.push({ book: book._id, borrowedAt: new Date() });

    // Add to readingHistory if not already there
    const existing = user.readingHistory.find(item => item.book.toString() === book._id.toString());
    if (!existing) {
      user.readingHistory.push({ book: book._id, status: 'reading' });
    } else {
      existing.status = 'reading';
    }

    await user.save();
    res.json({ message: "Book borrowed successfully", book });
  } catch (error) {
    console.error("BorrowBook Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Return book */
export const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const user = await User.findById(req.user);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availability)
      return res.status(400).json({ message: "Book is not currently borrowed" });

    /* Update book */
    book.availability = true;
    book.returnedAt = new Date();

    // Update the last borrow history entry for this user
    const lastHistory = [...book.borrowHistory].reverse().find(h => h.user.toString() === req.user.toString() && !h.returnedAt);
    if (lastHistory) {
      lastHistory.returnedAt = book.returnedAt;
    }

    book.borrowedBy = null;
    book.borrowedAt = null;

    await book.save();

    /* Update user */
    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b.book.toString() !== book._id.toString()
    );

    await user.save();

    res.json({ message: "Book returned successfully", book });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: error.message });
  }
};

/* Get borrow history for all books (admin) */
export const getBorrowHistory = async (req, res) => {
  try {
    // Use exec to get better stack traces on errors
    const books = await Book.find()
      .select('title borrowHistory')
      .populate('borrowHistory.user', 'name email')
      .exec();

    // Defensive: ensure array
    res.json(Array.isArray(books) ? books : []);
  } catch (error) {
    console.error('Error fetching borrow history:', error.stack || error);
    res.status(500).json({ message: (error.stack || error).toString() });
  }
};

/* Get currently borrowed books (admin) */
export const getCurrentBorrows = async (req, res) => {
  try {
    const books = await Book.find({ availability: false })
      .select('title author borrowedBy borrowedAt')
      .populate('borrowedBy', 'name email')
      .exec();

    res.json(Array.isArray(books) ? books : []);
  } catch (error) {
    console.error('Error fetching current borrows:', error.stack || error);
    res.status(500).json({ message: (error.stack || error).toString() });
  }
};

import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { admin } from '../middleware/admin.js';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBorrowHistory,
  getCurrentBorrows
} from '../controllers/bookController.js';

const router = express.Router();

/* Public routes */
router.get('/', getBooks);

/* Admin: borrow history (place BEFORE the `/:id` route so it doesn't get treated as an id)
   These are admin-only and need to be defined before the parameterized route. */
router.get('/borrow-history', protect, admin, getBorrowHistory);
router.get('/current-borrows', protect, admin, getCurrentBorrows);

/* Get book by ID (parameterized route kept after specific routes)
   This must remain after the specific admin routes to avoid accidental matches. */
router.get('/:id', getBookById);

/* Admin routes */
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

/* Borrowing routes (authenticated users) */
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

export default router;

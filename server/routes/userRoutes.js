import express from 'express';
import {
  getProfile,
  registerUser,
  loginUser,
  addToCart,
  removeFromCart,
  getCart,
  getBorrowedBooks
} from '../controllers/userController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

/* Authentication */
router.post('/register', registerUser);
router.post('/login', loginUser);

/* User profile */
router.get('/profile', protect, getProfile);

/* Cart */
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.delete('/cart/:bookId', protect, removeFromCart);

/* Borrowing-related (read-only for now) */
router.get('/borrowed-books', protect, getBorrowedBooks);

export default router;

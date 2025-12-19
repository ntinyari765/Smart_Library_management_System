import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook); // Only authorized users can create

router.route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;

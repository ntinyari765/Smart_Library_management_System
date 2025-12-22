import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { admin } from '../middleware/admin.js';
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

// Admin-only routes
router.post("/", protect, admin, createBook);
router.put("/:id", protect, admin, updateBook);
router.delete("/:id", protect, admin, deleteBook);

export default router;

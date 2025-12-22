import express from 'express';
import { getProfile, registerUser, loginUser } from '../controllers/userController.js';
import { addToCart, removeFromCart, getCart } from "../controllers/userController.js";
import { protect } from '../middleware/authmiddleware.js';
import User from "../models/User.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/cart', protect, getCart);           // Fetch current user's cart
router.post('/cart', protect, addToCart);        // Add book to cart
router.delete('/cart/:bookId', protect, removeFromCart); // Remove book from cart

export default router;


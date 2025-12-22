import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user).populate('readingHistory.book wishlist clubsJoined');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin',
      readingHistory: user.readingHistory,
      wishlist: user.wishlist,
      clubsJoined: user.clubsJoined,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Add a book to cart
export const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;
  const user = await User.findById(req.user);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const existing = user.cart.find(item => item.book.toString() === bookId);

  if (existing) {
    existing.quantity += quantity || 1;
  } else {
    user.cart.push({ book: bookId, quantity: quantity || 1 });
  }

  await user.save();
  res.json(user.cart);
};

// Remove a book from cart
export const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.status(401).json({ message: 'User not found' });
  user.cart = user.cart.filter(item => item.book.toString() !== req.params.bookId);
  await user.save();
  res.json(user.cart);
};

// Get current user's cart
export const getCart = async (req, res) => {
  const user = await User.findById(req.user).populate('cart.book');
  if (!user) return res.status(401).json({ message: 'User not found' });
  res.json(user.cart);
};


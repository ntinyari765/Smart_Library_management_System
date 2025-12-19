import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import authRoutes from './routes/authRoutes.js';
import Book from './models/Book.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/hello', (req, res) => {
  res.send({ message: 'API is running!' });
});

// Test book route
app.get('/api/test-book', async (req, res) => {
  const testBook = new Book({ title: "Sample Book", author: "Author Name", price: 20 });
  await testBook.save();
  res.json({ message: "Book saved!", book: testBook });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

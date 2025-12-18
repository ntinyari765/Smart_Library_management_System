const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/hello', (req, res) => {
  res.send({ message: 'API is running!' });
});

// TODO: Import routes
// const bookRoutes = require('./routes/bookRoutes');
// app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);
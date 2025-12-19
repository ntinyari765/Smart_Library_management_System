import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: String,
  description: String,
  ISBN: String,
  coverImage: String,
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  purchaseLink: String, // optional URL to buy the book
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);

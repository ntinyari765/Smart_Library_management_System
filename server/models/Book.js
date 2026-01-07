import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
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

    /* Borrowing & availability */
    availability: {
      type: Boolean,
      default: true
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    borrowedAt: {
      type: Date,
      default: null
    },
    returnedAt: {
      type: Date,
      default: null
    },

    /* Optional borrowing history */
    borrowHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        borrowedAt: Date,
        returnedAt: Date
      }
    ],

    /* Other features */
    rating: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    purchaseLink: String
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);

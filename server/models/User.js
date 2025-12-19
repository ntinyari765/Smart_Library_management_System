import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  readingHistory: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    status: { type: String, enum: ['reading', 'finished', 'to-read', 'purchased'], default: 'to-read' },
    rating: Number
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  clubsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  cart: [{ book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, quantity: { type: Number, default: 1 } }]

}, { timestamps: true });

export default mongoose.model('User', userSchema);

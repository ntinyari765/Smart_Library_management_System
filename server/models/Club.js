import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  bookAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meetingDates: [Date]
}, { timestamps: true });

export default mongoose.model('Club', clubSchema);

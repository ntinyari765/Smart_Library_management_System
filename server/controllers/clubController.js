import Club from '../models/Club.js';
import User from '../models/User.js';
import Book from '../models/Book.js';

// Get all clubs
export const getClubs = async (req, res) => {
  const clubs = await Club.find().populate('members bookAssigned');
  res.json(clubs);
};

// Get club by ID
export const getClubById = async (req, res) => {
  const club = await Club.findById(req.params.id).populate('members bookAssigned');
  if (club) res.json(club);
  else res.status(404).json({ message: 'Club not found' });
};

// Join club
export const joinClub = async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found' });

  if (!club.members.includes(req.user)) {
    club.members.push(req.user);
    await club.save();
    await User.findByIdAndUpdate(req.user, { $push: { clubsJoined: club._id } });
  }

  res.json({ message: 'Joined club', club });
};

// Leave club
export const leaveClub = async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: "Club not found" });

  // Remove user from club members if they are a member
  if (club.members.includes(req.user)) {
    club.members = club.members.filter(member => member.toString() !== req.user.toString());
    await club.save();

    // Remove club from user's clubsJoined
    await User.findByIdAndUpdate(req.user, { $pull: { clubsJoined: club._id } });
  }

  res.json({ message: "Left club", club });
};


// Assign book to club
export const assignBook = async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found' });

  const book = await Book.findById(req.body.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  club.bookAssigned = book._id;
  await club.save();

  res.json({ message: 'Book assigned to club', club });
};
 
// Create club (Admin only)
import mongoose from 'mongoose';

export const createClub = async (req, res) => {
  const { name, description, bookAssigned, meetingDates } = req.body;

  try {
    let bookId = undefined;

    if (bookAssigned) {
      // If it's a valid ObjectId, make sure the book exists
      if (mongoose.Types.ObjectId.isValid(bookAssigned)) {
        const exists = await Book.findById(bookAssigned);
        if (!exists) return res.status(400).json({ message: `Book with id ${bookAssigned} not found` });
        bookId = bookAssigned;
      } else {
        // Try to find a book by title (case-insensitive)
        const found = await Book.findOne({ title: { $regex: `^${bookAssigned}$`, $options: 'i' } });
        if (!found) return res.status(400).json({ message: `bookAssigned must be a book _id or existing book title; book not found: "${bookAssigned}"` });
        bookId = found._id;
      }
    }

    const club = await Club.create({ name, description, bookAssigned: bookId, meetingDates });
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update club (Admin only)
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    Object.assign(club, req.body);
    await club.save();
    res.json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete club (Admin only)
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    await club.remove();
    res.json({ message: "Club deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
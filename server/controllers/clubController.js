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

// Create club
export const createClub = async (req, res) => {
  const { name, description } = req.body;
  const club = new Club({ name, description, members: [req.user] });
  const createdClub = await club.save();

  // Add club to user's clubsJoined
  await User.findByIdAndUpdate(req.user, { $push: { clubsJoined: createdClub._id } });

  res.status(201).json(createdClub);
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

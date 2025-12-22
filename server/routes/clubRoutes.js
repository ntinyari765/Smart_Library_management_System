import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { admin } from '../middleware/admin.js';
import {
  createClub,
  getClubs,
  getClubById,
  joinClub,
  assignBook,
  updateClub,
  deleteClub,
  leaveClub
} from '../controllers/clubController.js';

const router = express.Router();

router.route('/')
  .get(getClubs)

router.route('/:id')
  .get(getClubById);

router.route('/:id/join')
  .post(protect, joinClub);

router.route('/:id/leave')
  .post(protect, leaveClub);

router.route('/:id/assign')
  .post(protect, assignBook);

// Admin-only routes
router.post("/", protect, admin, createClub);
router.put("/:id", protect, admin, updateClub);
router.delete("/:id", protect, admin, deleteClub);

export default router;

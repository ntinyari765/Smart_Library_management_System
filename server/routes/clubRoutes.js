import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createClub,
  getClubs,
  getClubById,
  joinClub,
  assignBook
} from '../controllers/clubController.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, createClub);

router.route('/:id')
  .get(getClubById);

router.route('/:id/join')
  .post(protect, joinClub);

router.route('/:id/assign')
  .post(protect, assignBook);

export default router;

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";
import { admin } from "../middleware/admin.js";
import { createBook, updateBook, deleteBook } from "../controllers/bookController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/books", protect, admin, createBook);
router.put("/books/:id", protect, admin, updateBook);
router.delete("/books/:id", protect, admin, deleteBook);


export default router;

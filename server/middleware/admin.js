import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Make sure you have a User model

// Protect route and check for admin
export const admin = async (req, res, next) => {
  try {
    // Get token from headers
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    token = token.split(" ")[1]; // Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token failed" });
  }
};

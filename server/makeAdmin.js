import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const makeAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const email = "winjoyntinyari9@gmail.com";
    const plainPassword = "admin123"; // choose your password

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await User.updateOne(
      { email },
      { $set: { password: hashedPassword, role: "admin", isAdmin: true } }
    );

    console.log("Update result:", result);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

makeAdmin();

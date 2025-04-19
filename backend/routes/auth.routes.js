import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!["player", "organiser"].includes(role)) return res.status(400).json("Invalid role");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful",token, userData: user });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json("User logged out");
});

export default router;

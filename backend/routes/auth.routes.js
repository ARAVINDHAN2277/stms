import express from "express";
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!["player", "organiser"].includes(role)) return res.status(400).json("Invalid role");

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ 
      data: { username, email, password: hashedPassword, role } 
    });
    res.status(201).json("User registered successfully");
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json("An account with this email already exists.");
    }
    console.error("Signup error:", err);
    res.status(500).json("Internal server error during registration.");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful",token, userData: user });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json("User logged out");
});

// GET /api/auth/stats (Player Dashboard Stats)
import authMiddleware from "../middleware/authMiddleware.js";
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [squadCount, registrationCount, winCount, activeRegistrations, upcomingMatches] = await Promise.all([
      prisma.squadMember.count({ where: { userId } }),
      prisma.tournamentRegistration.count({ where: { playerId: userId } }),
      prisma.match.count({ where: { winnerId: userId, status: 'Completed' } }),
      prisma.tournamentRegistration.findMany({
        where: { playerId: userId, tournament: { status: { in: ['Open', 'Ongoing'] } } },
        include: { tournament: true }
      }),
      prisma.match.findMany({
        where: { 
          OR: [
            { player1Id: userId },
            { player2Id: userId },
            { squad1: { members: { some: { userId } } } },
            { squad2: { members: { some: { userId } } } }
          ],
          status: 'Pending'
        },
        include: { 
          tournament: true,
          player1: true,
          player2: true,
          squad1: true,
          squad2: true
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      squadCount,
      registrationCount,
      winCount,
      activeRegistrations,
      upcomingMatches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch user stats");
  }
});

export default router;

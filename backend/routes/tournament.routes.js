import express from "express";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { runScheduler } from "../../../RoundRobinScheduler.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';

const router = express.Router();

// Register a new tournament
router.post("/register",authMiddleware, async (req, res) => {
  try {
    const { tournamentName, sportType, registrationFee, location } = req.body;
    const userId = req.user.id; // Extract from token
    console.log("hello")
    console.log(userId)
    const newTournament = new Tournament({
      tournamentName,
      sportType,
      registrationFee,
      location,
      organisedBy: userId,
    });
    console.log(userId)
    await newTournament.save();
    res.status(201).json({ message: "Tournament registered successfully Hello", tournament: newTournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tournaments/organiser/:organiserId
router.get('/organiser/:organiserId', async (req, res) => {
  try {
    const tournaments = await Tournament.find({ organisedBy: req.params.organiserId });
    console.log(req.params.organiserId);
    console.log(tournaments);
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/nearby', async (req, res) => {
  const { lat, lng, sport } = req.query;

  const radiusInKm = 50;
  const earthRadius = 6371; // Earth's radius in km

  const tournaments = await Tournament.find({
    sportType: sport
  });
  console.log(tournaments)
  // Haversine filtering on server
  const nearby = tournaments.filter(t => {
    const dLat = (t.location.lat - lat) * (Math.PI / 180);
    const dLng = (t.location.lng - lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(t.location.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    console.log(distance)
    return distance <= radiusInKm;
  });
  console.log(nearby)
  res.json(nearby);
});

// PATCH /api/tournaments/:id/register
router.patch('/:id/register', async (req, res) => {
  const { id } = req.params;
  const { playerId } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (!tournament.registeredPlayers.includes(playerId)) {
      tournament.registeredPlayers.push(playerId);
      await tournament.save();
    }

    res.json({ message: 'Player registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});
router.post('/:id/schedule', async (req, res) => {
  try {
    console.log("scheduler")
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const users = await User.find({ _id: { $in: tournament.registeredPlayers } });

    // Prepare input
    const teamLocations = new Map();
    const venues = new Map();
    const playerNames = users.map(user => user.username); 
    const includeReverseFixtures = true;
    const startDate = new Date(); // or some selected date
    const daysPerRound = 2;

    const scheduler = runScheduler(playerNames);
    generateSchedulePDF(scheduler);

    // Optional: Save schedule to DB here if needed
    // await Tournament.findByIdAndUpdate(req.params.id, { schedule: optimizedSchedule });

    res.json(scheduler);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


function generateSchedulePDF(scheduleText, fileName = 'schedule.pdf') {
  const doc = new PDFDocument();

  const writeStream = fs.createWriteStream(fileName);
  doc.pipe(writeStream);

  doc.fontSize(12).text(scheduleText, {
    width: 410,
    align: 'left'
  });

  doc.end();

  writeStream.on('finish', () => {
    console.log(`PDF saved to ${fileName}`);
  });
}

export default router;


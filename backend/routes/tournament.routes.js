import express from "express";
import prisma from "../utils/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { runScheduler } from "../utils/RoundRobinScheduler.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import transporter from '../utils/mailer.js';
import { emitToTournament, emitGlobal } from "../utils/socketManager.js";

const router = express.Router();

router.post('/testgeo', async (req, res) => {
  try {
    const { locationName } = req.body;
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`, {
      headers: { 'User-Agent': 'TourneyGrid/1.0' }
    });
    const geoData = await geoRes.json();
    return res.json(geoData);
  } catch (e) {
    console.error("Testgeo failed:", e);
    return res.status(500).json({ message: e.message, stack: e.stack });
  }
});

// Register a new tournament
router.post("/register",authMiddleware, async (req, res) => {
  console.log("----- INCOMING REGISTER REQUEST -----");
  console.log("Body:", req.body);
  try {
    const { tournamentName, sportType, registrationFee, locationText, location } = req.body;
    const userId = req.user.id; // Extract from token

    let lat, lng, locationName = locationText || null;
    console.log(`Parsed variables - User: ${userId}, LocationName: ${locationName}`);

    if (location && location.lat && location.lng) {
      lat = Number(location.lat);
      lng = Number(location.lng);
      
      // Reverse geocode if locationName is missing
      if (!locationName) {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'User-Agent': 'TourneyGrid/1.0' }
          });
          const geoData = await geoRes.json();
          if (geoData && geoData.display_name) {
            // Keep it reasonably short
            const parts = geoData.display_name.split(',');
            locationName = parts.slice(0, 3).join(',').trim();
          }
        } catch (e) {
          console.error("Reverse geocode failed:", e.message);
        }
      }
    } else if (locationName) {
      // Forward geocode
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`, {
          headers: { 'User-Agent': 'TourneyGrid/1.0' }
        });
        if (!geoRes.ok) {
           const errText = await geoRes.text();
           console.error("Nominatim gave non-OK response:", geoRes.status, errText);
           return res.status(500).json({ message: "Location Database is temporarily rate-limited. Please use map ping." });
        }
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        } else {
          return res.status(400).json({ message: "Could not locate the provided city/state." });
        }
      } catch (e) {
        console.error("Forward geocode failed:", e.message);
        return res.status(500).json({ message: "Geocoding service error. Try map ping." });
      }
    } else {
      return res.status(400).json({ message: "A location or map ping is required." });
    }

    const newTournament = await prisma.tournament.create({
      data: {
        tournamentName,
        sportType,
        registrationFee: Number(registrationFee),
        lat,
        lng,
        locationName, // Store nice name
        organiserId: userId,
        type: type || 'SOLO',
        teamSize: teamSize || 1,
      }
    });
    
    res.status(201).json({ message: "Tournament registered successfully", tournament: newTournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tournaments/organiser/:organiserId
router.get('/organiser/:organiserId', async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({ where: { organiserId: req.params.organiserId } });
    console.log(req.params.organiserId);
    console.log(tournaments);
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/nearby', async (req, res) => {
  let { lat, lng, sport, locationText } = req.query;

  if ((!lat || !lng) && locationText) {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`, {
        headers: { 'User-Agent': 'TourneyGrid/1.0' }
      });
      if (!geoRes.ok) {
        return res.status(500).json({ message: "Location Database is temporarily rate-limited." });
      }
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      } else {
        return res.status(400).json({ message: "Could not locate the provided city/state." });
      }
    } catch (e) {
      console.error("Forward geocode failed in nearby:", e.message);
      return res.status(500).json({ message: "Geocoding service error. Try map ping." });
    }
  } else if (!lat || !lng) {
    return res.status(400).json({ message: "Missing location parameters." });
  }

  lat = Number(lat);
  lng = Number(lng);

  const radiusInKm = 50;
  const earthRadius = 6371; // Earth's radius in km

  const tournaments = await prisma.tournament.findMany({
    where: { sportType: sport }
  });
  console.log(tournaments)
  // Haversine filtering on server
  const nearby = tournaments.filter(t => {
    const dLat = (t.lat - lat) * (Math.PI / 180);
    const dLng = (t.lng - lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(t.lat * (Math.PI / 180)) *
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
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { squadId } = req.body;
    const playerId = req.user.id;

    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    if (tournament.status !== 'Open') return res.status(400).json({ message: 'Registration is closed' });

    // If SQUAD tournament, check squadId
    if (tournament.type === 'SQUAD') {
      if (!squadId) return res.status(400).json({ message: 'Squad identification required for this event' });
      
      const squad = await prisma.squad.findUnique({ where: { id: squadId } });
      if (!squad || squad.captainId !== playerId) {
        return res.status(403).json({ message: 'Only the Squad Captain can register the team' });
      }
    }

    const registration = await prisma.tournamentRegistration.create({
      data: {
        playerId,
        tournamentId: id,
        squadId: tournament.type === 'SQUAD' ? squadId : null
      }
    });

    res.json({ message: 'Player registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});
// Advanced Single-Elimination Bracket Generator
router.post('/:id/schedule', authMiddleware, async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await prisma.tournament.findUnique({ 
      where: { id: tournamentId },
      include: { registeredPlayers: { include: { player: true } } }
    });

    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (tournament.organiserId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    // Check if bracket already exists
    const existingMatches = await prisma.match.count({ where: { tournamentId } });
    if (existingMatches > 0) return res.status(400).json({ error: 'Bracket already generated' });

    // Determine the entities being paired (Players or Squads)
    let entities = [];
    if (tournament.type === 'SQUAD') {
        const registrations = await prisma.tournamentRegistration.findMany({
            where: { tournamentId },
            include: { squad: true },
            distinct: ['squadId']
        });
        entities = registrations.filter(r => r.squadId).map(r => r.squad);
    } else {
        entities = tournament.registeredPlayers.map(reg => reg.player);
    }

    if (entities.length < 2) return res.status(400).json({ error: 'At least 2 entities required' });

    // Shuffle
    const shuffled = [...entities].sort(() => 0.5 - Math.random());
    const numEntities = shuffled.length;
    const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(numEntities)));
    const byes = powerOfTwo - numEntities;

    let matchCreationPromises = [];
    let entityIndex = 0;
    
    const numMatchesRound1 = powerOfTwo / 2;
    for (let i = 0; i < numMatchesRound1; i++) {
        const e1 = shuffled[entityIndex++];
        
        let e2 = null;
        if (i < byes) {
           // e2 is a BYE
        } else {
           e2 = shuffled[entityIndex++];
        }

        const matchStatus = e2 ? 'Pending' : 'Completed';
        const winnerId = (e2 || tournament.type === 'SQUAD') ? null : e1.id;
        const winnerSquadId = (e2 || tournament.type !== 'SQUAD') ? null : e1.id;

        matchCreationPromises.push(
            prisma.match.create({
                data: {
                    tournamentId,
                    player1Id: tournament.type !== 'SQUAD' ? e1.id : null,
                    player2Id: (tournament.type !== 'SQUAD' && e2) ? e2.id : null,
                    squad1Id: tournament.type === 'SQUAD' ? e1.id : null,
                    squad2Id: (tournament.type === 'SQUAD' && e2) ? e2.id : null,
                    round: 1,
                    matchIndex: i + 1,
                    status: matchStatus,
                    winnerId,
                    winnerSquadId
                }
            })
        );
    }

    await Promise.all(matchCreationPromises);

    // Optional: Send emails sequentially or broadcast to all
    const playerEmails = shuffled.map(u => u.email);
    const mailOptions = {
      from: 'bennyhinn53@gmail.com',
      to: playerEmails,
      subject: `Bracket Generated: ${tournament.tournamentName}`,
      text: 'The tournament bracket is live! Check the dashboard to view your next opponent.',
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.error('Error sending bracket notification:', error);
    });

    res.json({ message: 'Bracket generated and saved to Matrix.' });
  } catch (err) {
    console.error("Bracket generation failed:", err);
    res.status(500).json({ error: 'Failed to generate bracket' });
  }
});

// GET /api/tournaments/:id/dashboard
router.get('/:id/dashboard', authMiddleware, async (req, res) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        registeredPlayers: { include: { player: true, squad: true } },
        announcements: { orderBy: { createdAt: 'desc' } },
        matches: { include: { player1: true, player2: true, squad1: true, squad2: true } },
      }
    });
    if (!tournament) return res.status(404).json({ message: "Not found" });
    if (tournament.organiserId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tournaments/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { tournamentName, sportType, registrationFee, maxPlayers } = req.body;
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) return res.status(404).json({ message: "Not found" });
    if (tournament.organiserId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { tournamentName, sportType, registrationFee: Number(registrationFee), maxPlayers: maxPlayers ? Number(maxPlayers) : null }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/tournaments/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) return res.status(404).json({ message: "Not found" });
    if (tournament.organiserId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    
    const updated = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tournaments/:id/announcements
router.post('/:id/announcements', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const tournament = await prisma.tournament.findUnique({ 
      where: { id: req.params.id },
      include: { registeredPlayers: { include: { player: true } } }
    });
    if (!tournament) return res.status(404).json({ message: "Not found" });
    if (tournament.organiserId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const announcement = await prisma.announcement.create({
      data: { message, tournamentId: req.params.id }
    });

    const playerEmails = tournament.registeredPlayers.map(r => r.player.email);
    console.log(`Sending announcement to ${playerEmails.length} players: ${message}`);
    
    if (playerEmails.length > 0) {
      const mailOptions = {
        from: 'bennyhinn53@gmail.com',
        to: playerEmails,
        subject: `Announcement: ${tournament.tournamentName}`,
        text: message
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Error sending announcement email:', error);
      });
    }

    // Real-time broadcast
    emitToTournament(req.params.id, "new_announcement", announcement);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tournaments/:id/matches
router.get('/:id/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: { tournamentId: req.params.id },
      include: { player1: true, player2: true }
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/tournaments/match/:matchId
router.patch('/match/:matchId', authMiddleware, async (req, res) => {
  try {
    const { player1Score, player2Score, status, winnerId, winnerSquadId } = req.body;
    const matchId = req.params.matchId;

    const match = await prisma.match.findUnique({ where: { id: matchId }, include: { tournament: true } });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.tournament.organiserId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        player1Score: Number(player1Score),
        player2Score: Number(player2Score),
        status,
        winnerId,
        winnerSquadId
      }
    });

    if (status === 'Completed' && (winnerId || winnerSquadId)) {
        const nextRound = match.round + 1;
        const nextMatchIndex = Math.ceil(match.matchIndex / 2);

        let nextMatch = await prisma.match.findFirst({
            where: {
                tournamentId: match.tournamentId,
                round: nextRound,
                matchIndex: nextMatchIndex
            }
        });

        if (!nextMatch) {
             nextMatch = await prisma.match.create({
                data: {
                    tournamentId: match.tournamentId,
                    round: nextRound,
                    matchIndex: nextMatchIndex,
                    status: 'Pending'
                }
            });
        }

        const isFirstPosition = match.matchIndex % 2 !== 0;
        await prisma.match.update({
            where: { id: nextMatch.id },
            data: {
                [isFirstPosition ? 'player1Id' : 'player2Id']: winnerId,
                [isFirstPosition ? 'squad1Id' : 'squad2Id']: winnerSquadId
            }
        });
    }

    // Real-time Match Update
    emitToTournament(match.tournamentId, "match_update", updatedMatch);

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player registrations
router.get("/registrations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await prisma.tournamentRegistration.findMany({
      where: { playerId: userId },
      include: { 
        tournament: {
          include: { organiser: { select: { username: true } } }
        }
      },
      orderBy: { registeredAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


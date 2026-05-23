import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ensures only users with the 'organiser' role can access the route
export const requireOrganiser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== 'organiser') {
    return res.status(403).json({ message: "Access denied. Organiser role required." });
  }

  next();
};

// Ensures the authenticated organiser actually owns the tournament they are trying to modify
export const requireTournamentOwnership = async (req, res, next) => {
  try {
    const tournamentId = req.params.id; // Assuming route parameter is always /:id
    const organiserId = req.user.id;

    if (!tournamentId) {
      return res.status(400).json({ message: "Tournament ID is required" });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.organiserId !== organiserId) {
      return res.status(403).json({ message: "Access denied. You do not own this tournament." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error checking tournament ownership", error: error.message });
  }
};

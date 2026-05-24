import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireOrganiser, requireTournamentOwnership } from "../middleware/roleMiddleware.js";
import * as tournamentController from "../controllers/tournament.controller.js";

const router = express.Router();

router.post("/register", authMiddleware, requireOrganiser, tournamentController.registerTournament);
router.get("/organiser/:organiserId", authMiddleware, requireOrganiser, tournamentController.getOrganiserTournaments);
router.get("/nearby", authMiddleware, tournamentController.getNearbyTournaments);
router.get("/:id", authMiddleware, tournamentController.getTournamentById);

// Player registering for tournament
router.patch("/:id/register", authMiddleware, tournamentController.registerForTournament);

// Organiser managing tournament
router.patch("/:id/status", authMiddleware, requireOrganiser, requireTournamentOwnership, tournamentController.updateTournamentStatus);
router.patch("/:id/participants/:registrationId", authMiddleware, requireOrganiser, requireTournamentOwnership, tournamentController.updateParticipantStatus);
router.post("/:id/schedule", authMiddleware, requireOrganiser, requireTournamentOwnership, tournamentController.scheduleTournament);
router.patch("/:id/matches/:matchId", authMiddleware, requireOrganiser, requireTournamentOwnership, tournamentController.updateMatchScore);
router.delete("/:id", authMiddleware, requireOrganiser, requireTournamentOwnership, tournamentController.deleteTournament);

export default router;

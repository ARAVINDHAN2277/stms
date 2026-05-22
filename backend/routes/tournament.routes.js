import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as tournamentController from "../controllers/tournament.controller.js";

const router = express.Router();

router.post("/register", authMiddleware, tournamentController.registerTournament);
router.get("/organiser/:organiserId", tournamentController.getOrganiserTournaments);
router.get("/nearby", tournamentController.getNearbyTournaments);
router.patch("/:id/register", tournamentController.registerForTournament);
router.post("/:id/schedule", tournamentController.scheduleTournament);

export default router;

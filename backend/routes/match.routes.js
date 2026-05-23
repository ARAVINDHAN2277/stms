import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireOrganiser } from "../middleware/roleMiddleware.js";
import * as matchController from "../controllers/match.controller.js";

const router = express.Router();

// Match level endpoints for Organiser
router.patch("/:matchId/score", authMiddleware, requireOrganiser, matchController.updateMatchScore);
router.patch("/:matchId/schedule", authMiddleware, requireOrganiser, matchController.updateMatchSchedule);

export default router;

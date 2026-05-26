import express from "express";
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.getMe);
router.put("/profile", authMiddleware, authController.updateProfile);

export default router;

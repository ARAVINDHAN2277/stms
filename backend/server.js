import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error("Missing environment variables! Check .env file.");
}

import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import matchRoutes from "./routes/match.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/match", matchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
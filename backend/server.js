import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.JWT_SECRET)
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.log(process.env.JWT_SECRET)
  throw new Error("Missing environment variables! Check .env file.");
}
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import squadRoutes from "./routes/squad.routes.js";


import { createServer } from "http";
import { initSocket } from "./utils/socketManager.js";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use('/api/squads', squadRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT} with WebSocket support`));
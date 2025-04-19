import express from "express";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.JWT_SECRET)
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.log(process.env.JWT_SECRET)
  throw new Error("Missing environment variables! Check .env file.");
}
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch((err) => console.log(err));
 
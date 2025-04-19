import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, required: true, unique: true },
    sportType: { type: String, enum: ["Football", "Basketball", "Tennis", "Cricket"], required: true },
    registrationFee: { type: Number, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    organisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registeredPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // <-- Added
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", TournamentSchema);

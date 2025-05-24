// src/models/Coach.ts
import mongoose, { Document, Schema } from "mongoose";

// Re-using your provided interface for type safety
export interface ICoachingStaff extends Document {
  // Renamed CoachingStaffTypes to ICoachingStaff
  name: string;
  role: string;
  img: string;
  bio?: string; // Added bio as it's common for coaches
}

const CoachSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g., Head Coach, Assistant Coach, Goalkeeping Coach
    img: { type: String, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

const Coach = mongoose.model<ICoachingStaff>("Coach", CoachSchema);
export default Coach;

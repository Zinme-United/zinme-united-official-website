import mongoose, { Document, Schema } from "mongoose";

export interface ICoachingStaff extends Document {
  name: string;
  role: string;
  img: string;
  bio?: string;
}

const CoachSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

const Coach = mongoose.model<ICoachingStaff>("Coach", CoachSchema);
export default Coach;

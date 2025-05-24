// src/models/Activity.ts
import mongoose, { Document, Schema } from "mongoose";

export type ActivityType = "event" | "training" | "match";

export interface IActivity extends Document {
  title: string;
  description?: string;
  type: ActivityType; // event, training, match
  date: Date;
  time?: string; // e.g., "19:00", "10:30 AM"
  location: string;
  opponent?: string; // Only for 'match' type
  result?: string; // For past matches, e.g., "3-1 win", "2-2 draw"
  isNextMatch?: boolean; // To easily identify the next match
  isFeaturedEvent?: boolean; // For important events
}

const ActivitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      required: true,
      enum: ["event", "training", "match"],
    },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String, required: true },
    opponent: { type: String },
    result: { type: String },
    isNextMatch: { type: Boolean, default: false },
    isFeaturedEvent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;

import mongoose, { Document, Schema } from "mongoose";

export type ActivityType = "event" | "training" | "match";

export interface IActivity extends Document {
  title: string;
  description?: string;
  type: ActivityType;
  date: Date;
  time?: string;
  location: string;
  opponent?: string;
  result?: string;
  isNextMatch?: boolean;
  isFeaturedEvent?: boolean;
  homeTeamLogoUrl?: string;
  homeTeamLogoPublicId?: string;
  opponentTeamLogoUrl?: string;
  opponentTeamLogoPublicId?: string;
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
    homeTeamLogoUrl: { type: String },
    homeTeamLogoPublicId: { type: String },
    opponentTeamLogoUrl: { type: String },
    opponentTeamLogoPublicId: { type: String },
  },
  { timestamps: true }
);

ActivitySchema.index({ isNextMatch: 1 });

ActivitySchema.pre("save", async function (next) {
  if (
    this.isModified("isNextMatch") &&
    this.isNextMatch === true &&
    this.type === "match"
  ) {
    await (this.constructor as typeof Activity).updateMany(
      { _id: { $ne: this._id }, type: "match", isNextMatch: true },
      { $set: { isNextMatch: false } }
    );
  }
  next();
});

const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;

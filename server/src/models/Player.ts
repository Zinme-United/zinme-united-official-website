import mongoose, { Document, Schema } from "mongoose";

export interface PlayerStats {
  appearances: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
}

export interface PlayerSocial {
  twitter?: string; // Made optional as per typical social media usage
  instagram?: string; // Made optional
}

export interface IPlayer extends Document {
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  stats: PlayerStats;
  social?: PlayerSocial;
}

const PlayerStatsSchema: Schema = new Schema(
  {
    appearances: { type: Number, required: true, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
  },
  { _id: false }
);

const PlayerSocialSchema: Schema = new Schema(
  {
    twitter: { type: String },
    instagram: { type: String },
  },
  { _id: false }
);

const PlayerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    position: { type: String, required: true },
    img: { type: String, required: true },
    bio: { type: String, required: true },
    stats: { type: PlayerStatsSchema, required: true },
    social: { type: PlayerSocialSchema },
  },
  { timestamps: true }
);

const Player = mongoose.model<IPlayer>("Player", PlayerSchema);
export default Player;

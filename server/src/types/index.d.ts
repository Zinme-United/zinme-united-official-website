import { Document } from "mongoose";

export interface PlayerStats {
  appearances: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
}

export interface PlayerSocial {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface IPlayer extends Document {
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  gender: "Male" | "Female";
  stats: PlayerStats;
  social?: PlayerSocial;
}

export interface UploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
}

export interface BackendErrorResponse {
  message: string;
  stack?: string;
  status?: boolean;
}

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
}

export interface ActivityFormData {
  title: string;
  description?: string;
  type: ActivityType;
  date: string;
  time?: string;
  location: string;
  opponent?: string;
  result?: string;
  isNextMatch?: boolean;
  isFeaturedEvent?: boolean;
}

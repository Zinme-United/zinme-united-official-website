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

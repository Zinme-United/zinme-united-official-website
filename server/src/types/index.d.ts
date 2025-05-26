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
  stats: PlayerStats;
  social?: PlayerSocial;
}

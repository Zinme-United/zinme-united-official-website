export interface PlayerStats {
  appearances: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
}

export interface PlayerSocial {
  twitter: string;
  instagram: string;
}

export interface PlayerTypes {
  id: number;
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  stats: PlayerStats;
  social: PlayerSocial;
}

export interface CoachingStaffTypes {
  id: number;
  name: string;
  role: string;
  img: string;
}

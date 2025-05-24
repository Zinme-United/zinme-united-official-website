// client/src/types/index.ts

// Corrected PlayerTypes interface to match backend's _id as string
export interface PlayerTypes {
  _id: string; // Changed from 'id: number' to '_id: string' to match MongoDB
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  stats: {
    appearances: number;
    goals?: number; // Optional
    assists?: number; // Optional
    cleanSheets?: number; // Optional
  };
  social?: {
    // Optional
    twitter?: string; // Optional
    instagram?: string; // Optional
  };
}

export interface CoachingStaffTypes {
  id: number; // Assuming this remains a number for hardcoded staff
  name: string;
  role: string;
  img: string;
}

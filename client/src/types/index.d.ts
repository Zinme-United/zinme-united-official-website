export interface CoachingStaffTypes {
  id: number;
  name: string;
  role: string;
  img: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  count?: number;
}

export interface Player {
  _id: string;
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  stats: {
    appearances: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface BackendErrorResponse {
  message: string;
  stack?: string;
}

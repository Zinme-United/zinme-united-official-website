export interface ApiResponse<T> {
  message: string;
  data?: T;
  count?: number;
  devOnly?: {
    resetToken: string;
    resetURL: string;
    warning: string;
    tokenDetails?: any;
  };
}

export interface BackendErrorResponse {
  message: string;
  stack?: string;
  status?: boolean;
}

export interface ImageUploadResponse {
  status: boolean;
  message: string;
  data: {
    imageUrl: string;
    publicId: string;
  };
}

export interface Player {
  _id: string;
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  gender: "Male" | "Female";
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

export interface PlayerFormData {
  name: string;
  number: number;
  position: string;
  img: string;
  bio: string;
  gender: "Male" | "Female";
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

export interface CoachingStaffTypes {
  id: number;
  name: string;
  role: string;
  img: string;
}

export interface IImage {
  url: string;
  caption?: string;
  publicId: string;
}

export interface Gallery {
  _id: string;
  title: string;
  description?: string;
  eventDate?: string;
  images: IImage[];
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFormData {
  title: string;
  description?: string;
  eventDate?: string;
  images: IImage[];
  thumbnailUrl?: string;
}

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "public";
}

export interface AuthResponseData {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "public";
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  role: "admin" | "editor" | "public" | null;
}

// --- Component Props (New from user's input) ---
export interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlayer: Player | null;
  onSubmit: (data: PlayerFormData, imageFile: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGallery: Gallery | null;
  onSubmit: (
    data: GalleryFormInputs,
    currentImages: IImage[],
    newImageFiles: File[],
    newImageCaptions: string[]
  ) => Promise<void>;
  isSubmitting: boolean;
  uploadImageProgress: boolean;
}

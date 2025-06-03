import multer from "multer";
import { Request, Response, NextFunction } from "express";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for single image upload
export const uploadSingle = upload.single("image");

export const uploadActivityLogos = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB per file
  },
}).fields([
  { name: "homeTeamLogoFile", maxCount: 1 },
  { name: "opponentTeamLogoFile", maxCount: 1 },
]);

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        status: false,
        message: "File too large. Maximum size is 5MB.",
      });
      return;
    }
  }

  if (error.message === "Only image files are allowed!") {
    res.status(400).json({
      status: false,
      message: "Only image files are allowed.",
    });
    return;
  }

  next(error);
};

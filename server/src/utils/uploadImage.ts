import { UploadApiResponse } from "cloudinary";
import { UploadOptions } from "../types";
import cloudinary from "../config/cloudinary";

export const uploadImage = async (
  file: Express.Multer.File,
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "players",
      transformation: [
        {
          width: options.width || 400,
          height: options.height || 400,
          crop: options.crop || "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload failed"));
        }
      })
      .end(file.buffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

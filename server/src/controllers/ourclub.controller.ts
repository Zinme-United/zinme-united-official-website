import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { uploadImage, deleteImage } from "../utils/uploadImage";
import OurClub, { IOurClub } from "../models/OurClub";

// Helper: get singleton About doc
const getSingleton = async () => {
  const doc = await OurClub.findOne({});
  return doc;
};

export const uploadOurClubHeroImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }
    try {
      const result = await uploadImage(req.file, {
        folder: "ourclub",
        width: 1920,
        height: 1080,
        crop: "fill",
      });

      res.status(200).json({
        status: true,
        message: "Hero image uploaded successfully!",
        data: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (err) {
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary.");
    }
  }
);

export const getOurClub = asyncHandler(async (_req: Request, res: Response) => {
  const about = await getSingleton();
  res.status(200).json({
    status: true,
    message: "About fetched successfully.",
    data: about || null,
  });
});

// Create only if not exists
export const createOurClub = asyncHandler(
  async (req: Request, res: Response) => {
    const exists = await getSingleton();
    if (exists) {
      res.status(409);
      throw new Error("OurClub document already exists. Use update instead.");
    }

    const about = new OurClub(req.body as IOurClub);
    const created = await about.save();
    res.status(201).json({
      status: true,
      message: "About created successfully.",
      data: created,
    });
  }
);

// Full update (upsert semantics if none exists)
export const updateAbout = asyncHandler(async (req: Request, res: Response) => {
  let about = await getSingleton();

  // If swapping hero image, optionally remove previous image
  if (
    about?.heroPublicId &&
    req.body?.heroPublicId &&
    req.body.heroPublicId !== about.heroPublicId
  ) {
    try {
      await deleteImage(about.heroPublicId);
    } catch (e) {
      console.warn("Hero image delete failed:", e);
    }
  }

  if (!about) {
    about = new OurClub(req.body as IOurClub);
  } else {
    Object.assign(about, req.body);
  }

  const saved = await about.save();
  res.status(200).json({
    status: true,
    message: "OurClub updated successfully.",
    data: saved,
  });
});

// Partial update (PATCH)
export const patchOurClub = asyncHandler(
  async (req: Request, res: Response) => {
    const about = await getSingleton();
    if (!about) {
      res.status(404);
      throw new Error("OurClub not found. Create it first.");
    }

    if (
      about.heroPublicId &&
      req.body?.heroPublicId &&
      req.body.heroPublicId !== about.heroPublicId
    ) {
      try {
        await deleteImage(about.heroPublicId);
      } catch (e) {
        console.warn("Hero image delete failed:", e);
      }
    }

    Object.assign(about, req.body);
    const saved = await about.save();

    res.status(200).json({
      status: true,
      message: "About patched successfully.",
      data: saved,
    });
  }
);

export const deleteOurClub = asyncHandler(
  async (_req: Request, res: Response) => {
    const ourClub = await getSingleton();
    if (!ourClub) {
      res.status(404);
      throw new Error("About not found.");
    }

    // delete hero image if present
    if (ourClub.heroPublicId) {
      try {
        await deleteImage(ourClub.heroPublicId);
      } catch (e) {
        console.warn("Hero image delete failed:", e);
      }
    }

    await OurClub.deleteOne({ _id: ourClub._id });
    res
      .status(200)
      .json({ status: true, message: "OurClub removed successfully." });
  }
);

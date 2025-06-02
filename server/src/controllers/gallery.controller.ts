import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Gallery, { IGallery, IImage } from "../models/Gallery";
import { deleteImage, uploadImage } from "../utils/uploadImage";

export const uploadGalleryImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }

    try {
      const result = await uploadImage(req.file, {
        folder: "galleries",
        width: 600,
        height: 600,
        crop: "fill",
      });

      res.status(200).json({
        status: true,
        message: "Image uploaded successfully!",
        data: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary.");
    }
  }
);

export const createGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, eventDate, images, thumbnailUrl } = req.body;

    if (!title) {
      res.status(400);
      throw new Error("Gallery title is required.");
    }

    if (
      !Array.isArray(images) ||
      !images.every((img: IImage) => {
        console.log(
          `Image URL: ${img.url}, PublicId: '${
            img.publicId
          }', PublicId is string: ${typeof img.publicId === "string"}`
        );
        return img.url && typeof img.publicId === "string";
      })
    ) {
      res.status(400);
      throw new Error(
        "Images must be an array of objects with 'url' and 'publicId' (as a string)."
      );
    }

    const gallery: IGallery = new Gallery({
      title,
      description,
      eventDate,
      images,
      thumbnailUrl,
    });

    const createdGallery = await gallery.save();
    res.status(201).json({
      status: true,
      message: "Gallery created successfully.",
      data: createdGallery,
    });
  }
);

export const getGalleries = asyncHandler(
  async (req: Request, res: Response) => {
    const galleries = await Gallery.find({}).sort({
      eventDate: -1,
      createdAt: -1,
    });
    res.status(200).json({
      status: true,
      message: "Galleries fetched successfully.",
      count: galleries.length,
      data: galleries,
    });
  }
);

export const getGalleryById = asyncHandler(
  async (req: Request, res: Response) => {
    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      res.status(200).json({
        status: true,
        message: "Gallery fetched successfully.",
        data: gallery,
      });
    } else {
      res.status(404);
      throw new Error("Gallery not found.");
    }
  }
);

export const updateGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, eventDate, images, thumbnailUrl } = req.body;

    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      gallery.title = title || gallery.title;
      gallery.description = description ?? gallery.description;
      gallery.eventDate = eventDate ?? gallery.eventDate;

      if (
        Array.isArray(images) &&
        images.every((img: IImage) => {
          return img.url && typeof img.publicId === "string";
        })
      ) {
        const existingPublicIds = gallery.images
          .map((img) => img.publicId)
          .filter(Boolean);
        const newPublicIds = images
          .map((img: IImage) => img.publicId)
          .filter(Boolean);

        const publicIdsToDelete = existingPublicIds.filter(
          (id) => !newPublicIds.includes(id)
        );

        for (const publicId of publicIdsToDelete) {
          try {
            if (publicId) await deleteImage(publicId);
          } catch (error) {
            console.error(
              `Failed to delete old image ${publicId} from Cloudinary:`,
              error
            );
          }
        }
        gallery.images = images;
      } else if (images !== undefined) {
        res.status(400);
        throw new Error(
          "Images must be an array of objects with 'url' and 'publicId' (as a string)."
        );
      }

      gallery.thumbnailUrl = thumbnailUrl ?? gallery.thumbnailUrl;

      const updatedGallery = await gallery.save();
      res.status(200).json({
        status: true,
        message: "Gallery updated successfully.",
        data: updatedGallery,
      });
    } else {
      res.status(404);
      throw new Error("Gallery not found.");
    }
  }
);

export const deleteGallery = asyncHandler(
  async (req: Request, res: Response) => {
    const gallery = await Gallery.findById(req.params.id);

    if (gallery) {
      // Delete all images associated with the gallery from Cloudinary
      if (gallery.images && gallery.images.length > 0) {
        for (const image of gallery.images) {
          if (image.publicId) {
            try {
              await deleteImage(image.publicId);
            } catch (error) {
              console.error(
                `Error deleting image ${image.publicId} from Cloudinary:`,
                error
              );
            }
          }
        }
      }

      await Gallery.deleteOne({ _id: req.params.id });
      res.status(200).json({
        status: true,
        message: "Gallery removed successfully.",
      });
    } else {
      res.status(404);
      throw new Error("Gallery not found.");
    }
  }
);

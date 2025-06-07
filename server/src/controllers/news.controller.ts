import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { deleteImage, uploadImage } from "../utils/uploadImage";
import News, { INews } from "../models/News";

export const uploadNewsImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }

    try {
      const result = await uploadImage(req.file, {
        folder: "newsImages",
        width: 400,
        height: 400,
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
      console.error("Failed to upload image to Cloudinary:", error);
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary.");
    }
  }
);

export const createNews = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    content,
    author,
    imageUrl,
    imagePublicId,
    publishedAt,
    tags,
    isFeatured,
  } = req.body;

  // Basic validation
  if (!title || !content || !author) {
    res.status(400);
    throw new Error(
      "Please include all required news fields: title, content, and author."
    );
  }

  const news: INews = new News({
    title,
    content,
    author,
    imageUrl,
    imagePublicId, // Save public ID
    publishedAt: publishedAt ? new Date(publishedAt) : Date.now(),
    tags: tags || [], // Ensure tags is an array
    isFeatured: isFeatured || false,
  });

  const createdNews = await news.save();
  res.status(201).json({
    status: true,
    message: "News article created successfully.",
    data: createdNews,
  });
});

export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const { isFeatured, tag, author, startDate, endDate } = req.query;
  const filter: any = {};

  if (isFeatured === "true") {
    filter.isFeatured = true;
  }
  if (tag && typeof tag === "string") {
    filter.tags = tag; // Find news articles containing this tag
  }
  if (author && typeof author === "string") {
    filter.author = author;
  }

  if (startDate || endDate) {
    filter.publishedAt = {};
    if (startDate && typeof startDate === "string") {
      filter.publishedAt.$gte = new Date(startDate);
    }
    if (endDate && typeof endDate === "string") {
      filter.publishedAt.$lte = new Date(endDate);
    }
  }

  const newsArticles = await News.find(filter).sort({
    publishedAt: -1,
    createdAt: -1,
  }); // Sort by most recent first
  res.status(200).json({
    status: true,
    message: "News articles fetched successfully.",
    count: newsArticles.length,
    data: newsArticles,
  });
});

export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const news = await News.findById(req.params.id);

  if (news) {
    res.status(200).json({
      status: true,
      message: "News article fetched successfully.",
      data: news,
    });
  } else {
    res.status(404);
    throw new Error("News article not found.");
  }
});

export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    content,
    author,
    imageUrl, // New imageUrl from pre-upload or empty string
    imagePublicId, // New publicId from pre-upload or empty string
    publishedAt,
    tags,
    isFeatured,
  } = req.body;

  const news = await News.findById(req.params.id);

  if (news) {
    // Handle image update logic:
    // If a new imageUrl is provided (or old one is explicitly cleared by sending empty string)
    // AND the publicId is different from the existing one, delete the old image.
    if (
      imageUrl !== undefined &&
      imagePublicId !== undefined &&
      news.imagePublicId &&
      news.imagePublicId !== imagePublicId
    ) {
      await deleteImage(news.imagePublicId);
    }
    // Update image fields regardless of deletion (could be adding new, clearing, or keeping same)
    news.imageUrl = imageUrl ?? news.imageUrl;
    news.imagePublicId = imagePublicId ?? news.imagePublicId;

    news.title = title || news.title;
    news.content = content || news.content;
    news.author = author || news.author;
    news.publishedAt = publishedAt ? new Date(publishedAt) : news.publishedAt;
    news.tags = tags !== undefined ? tags : news.tags; // Allow clearing tags
    news.isFeatured = isFeatured ?? news.isFeatured;

    const updatedNews = await news.save();
    res.status(200).json({
      status: true,
      message: "News article updated successfully.",
      data: updatedNews,
    });
  } else {
    res.status(404);
    throw new Error("News article not found.");
  }
});

export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await News.findById(req.params.id);

  if (news) {
    // Delete associated image from Cloudinary if it exists
    if (news.imagePublicId) {
      await deleteImage(news.imagePublicId);
    }

    await News.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: true,
      message: "News article removed successfully.",
    });
  } else {
    res.status(404);
    throw new Error("News article not found.");
  }
});

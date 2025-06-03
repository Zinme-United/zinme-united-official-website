import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ActivityType, IActivity } from "../types";
import Activity from "../models/Activity";
import { deleteImage, uploadImage } from "../utils/uploadImage";

export const uploadTeamLogo = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }

    try {
      const result = await uploadImage(req.file, {
        folder: "teamLogos",
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
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary.");
    }
  }
);

export const createActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      type,
      date,
      time,
      location,
      opponent,
      result,
      isNextMatch,
      isFeaturedEvent,
      homeTeamLogoUrl,
      homeTeamLogoPublicId,
      opponentTeamLogoUrl,
      opponentTeamLogoPublicId,
    } = req.body;

    if (!title || !type || !date || !location) {
      res.status(400);
      throw new Error(
        "Please include all required activity fields: title, type, date, and location."
      );
    }

    // Validate activity type
    const validTypes: ActivityType[] = ["event", "training", "match"];
    if (!validTypes.includes(type)) {
      res.status(400);
      throw new Error(
        `Invalid activity type. Must be one of: ${validTypes.join(", ")}`
      );
    }

    const activity: IActivity = new Activity({
      title,
      description,
      type,
      date: new Date(date),
      time,
      location,
      opponent,
      result,
      isNextMatch,
      isFeaturedEvent,
      homeTeamLogoUrl,
      homeTeamLogoPublicId,
      opponentTeamLogoUrl,
      opponentTeamLogoPublicId,
    });

    const createdActivity = await activity.save();
    res.status(201).json({
      status: true,
      message: "Activity created successfully.",
      data: createdActivity,
    });
  }
);

export const getActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const { type, month, year, isNextMatch, isFeaturedEvent } = req.query;
    const filter: any = {};

    if (
      type &&
      typeof type === "string" &&
      ["event", "training", "match"].includes(type)
    ) {
      filter.type = type;
    }

    if (month && year) {
      const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
      const endOfMonth = new Date(Number(year), Number(month), 0);
      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (year) {
      const startOfYear = new Date(Number(year), 0, 1);
      const endOfYear = new Date(Number(year) + 1, 0, 0);
      filter.date = { $gte: startOfYear, $lte: endOfYear };
    }

    if (isNextMatch === "true") {
      filter.isNextMatch = true;
    }
    if (isFeaturedEvent === "true") {
      filter.isFeaturedEvent = true;
    }

    const activities = await Activity.find(filter).sort({
      date: 1,
      time: 1,
      createdAt: 1,
    });
    res.status(200).json({
      status: true,
      message: "Activities fetched successfully.",
      count: activities.length,
      data: activities,
    });
  }
);

export const getActivityById = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      res.status(200).json({
        status: true,
        message: "Activity fetched successfully.",
        data: activity,
      });
    } else {
      res.status(404);
      throw new Error("Activity not found.");
    }
  }
);

export const updateActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      type,
      date,
      time,
      location,
      opponent,
      result,
      isNextMatch,
      isFeaturedEvent,
      homeTeamLogoUrl,
      homeTeamLogoPublicId,
      opponentTeamLogoUrl,
      opponentTeamLogoPublicId,
    } = req.body;

    const activity = await Activity.findById(req.params.id);

    if (activity) {
      if (homeTeamLogoUrl !== undefined && homeTeamLogoPublicId !== undefined) {
        if (
          activity.homeTeamLogoPublicId &&
          activity.homeTeamLogoPublicId !== homeTeamLogoPublicId
        ) {
          await deleteImage(activity.homeTeamLogoPublicId);
        }
        activity.homeTeamLogoUrl = homeTeamLogoUrl;
        activity.homeTeamLogoPublicId = homeTeamLogoPublicId;
      }

      if (
        opponentTeamLogoUrl !== undefined &&
        opponentTeamLogoPublicId !== undefined
      ) {
        if (
          activity.opponentTeamLogoPublicId &&
          activity.opponentTeamLogoPublicId !== opponentTeamLogoPublicId
        ) {
          await deleteImage(activity.opponentTeamLogoPublicId);
        }
        activity.opponentTeamLogoUrl = opponentTeamLogoUrl;
        activity.opponentTeamLogoPublicId = opponentTeamLogoPublicId;
      }

      activity.title = title || activity.title;
      activity.description = description ?? activity.description;
      activity.type = type || activity.type;
      activity.date = date ? new Date(date) : activity.date;
      activity.time = time ?? activity.time;
      activity.location = location || activity.location;
      activity.opponent = opponent ?? activity.opponent;
      activity.result = result ?? activity.result;
      activity.isNextMatch = isNextMatch ?? activity.isNextMatch;
      activity.isFeaturedEvent = isFeaturedEvent ?? activity.isFeaturedEvent;

      const updatedActivity = await activity.save();
      res.status(200).json({
        status: true,
        message: "Activity updated successfully.",
        data: updatedActivity,
      });
    } else {
      res.status(404);
      throw new Error("Activity not found.");
    }
  }
);

export const deleteActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const activity = await Activity.findById(req.params.id);

    if (activity) {
      if (activity.homeTeamLogoPublicId) {
        await deleteImage(activity.homeTeamLogoPublicId);
      }
      if (activity.opponentTeamLogoPublicId) {
        await deleteImage(activity.opponentTeamLogoPublicId);
      }

      await Activity.deleteOne({ _id: req.params.id });
      res.status(200).json({
        status: true,
        message: "Activity removed successfully.",
      });
    } else {
      res.status(404);
      throw new Error("Activity not found.");
    }
  }
);

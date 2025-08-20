import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Player from "../models/Player";
import { IPlayer } from "../types";
import { deleteImage, uploadImage } from "../utils/uploadImage";

export const uploadPlayerImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    try {
      const result = await uploadImage(req.file, {
        folder: "players",
        width: 400,
        height: 400,
        crop: "fill",
      });

      res.status(200).json({
        status: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      res.status(500);
      throw new Error("Failed to upload image");
    }
  }
);

export const createPlayer = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      number,
      position,
      img,
      bio,
      age,
      dateOfBirth,
      gender,
      stats,
      social,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !number ||
      !position ||
      !img ||
      !bio ||
      !age ||
      !dateOfBirth ||
      !gender ||
      !stats ||
      !stats.appearances
    ) {
      res.status(400);
      throw new Error(
        "Please include all required player fields: name, number, position, bio, age, date of birth, gender, and player stats with appearances, and ensure an image is provided."
      );
    }

    const playerExists = await Player.findOne({ number, gender });
    if (playerExists) {
      res.status(400);
      throw new Error(
        `Player with jersey number ${number} and ${gender} already exists.`
      );
    }

    const player: IPlayer = new Player({
      name,
      number,
      position,
      img,
      bio,
      age,
      dateOfBirth,
      gender,
      stats,
      social,
    });

    const savedPlayer = await player.save();
    res.status(201).json({
      status: true,
      message: "Players created successfully.",
      data: savedPlayer,
    });
  }
);

// @desc    Get all players
// @route   GET /api/players
// @access  Public
export const getPlayers = asyncHandler(async (req: Request, res: Response) => {
  const players = await Player.find({});
  res.status(200).json({
    status: true,
    message: "Players fetched successfully.",
    count: players.length,
    data: players,
  });
});

// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Public
export const getPlayerById = asyncHandler(
  async (req: Request, res: Response) => {
    const player = await Player.findById(req.params.id);

    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404);
      throw new Error("Player not found.");
    }
  }
);

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Admin
export const updatePlayer = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      number,
      position,
      img,
      bio,
      age,
      dateOfBirth,
      gender,
      stats,
      social,
    } = req.body;

    const player = await Player.findById(req.params.id);

    if (player) {
      // Update fields if provided
      player.name = name || player.name;
      player.number = number || player.number;
      player.position = position || player.position;
      player.img = img || player.img;
      player.bio = bio || player.bio;
      player.age = age || player.age;
      player.dateOfBirth = dateOfBirth || player.dateOfBirth;
      player.gender = gender || player.gender;

      if (stats) {
        player.stats.appearances =
          stats.appearances !== undefined
            ? stats.appearances
            : player.stats.appearances;
        player.stats.goals =
          stats.goals !== undefined ? stats.goals : player.stats.goals;
        player.stats.assists =
          stats.assists !== undefined ? stats.assists : player.stats.assists;
        player.stats.cleanSheets =
          stats.cleanSheets !== undefined
            ? stats.cleanSheets
            : player.stats.cleanSheets;
      }

      // Handle social field update
      if (social) {
        player.social = {
          facebook:
            social.facebook !== undefined
              ? social.facebook
              : player.social?.facebook,
          twitter:
            social.twitter !== undefined
              ? social.twitter
              : player.social?.twitter,
          instagram:
            social.instagram !== undefined
              ? social.instagram
              : player.social?.instagram,
        };
      } else {
        player.social = undefined;
      }

      const updatedPlayer = await player.save();
      res.status(200).json(updatedPlayer);
    } else {
      res.status(404);
      throw new Error("Player not found.");
    }
  }
);

export const deletePlayer = asyncHandler(
  async (req: Request, res: Response) => {
    const player = await Player.findById(req.params.id);

    if (player) {
      if (player.img) {
        try {
          const urlParts = player.img.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = `players/${publicIdWithExtension.split(".")[0]}`;
          await deleteImage(publicId);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
        }
      }

      await Player.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Player removed successfully." });
    } else {
      res.status(404);
      throw new Error("Player not found.");
    }
  }
);

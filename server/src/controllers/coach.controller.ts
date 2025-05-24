import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Coach, { ICoachingStaff } from "../models/Coach";

export const createCoach = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, img, bio } = req.body;

  if (!name || !role || !img) {
    res.status(400);
    throw new Error(
      "Please include all required coach fields: name, role, and image URL."
    );
  }

  const coach: ICoachingStaff = new Coach({
    name,
    role,
    img,
    bio,
  });

  const savedCoach = await coach.save();
  res.status(201).json({
    status: true,
    message: "Coach created successfully.",
    data: savedCoach,
  });
});

export const getCoaches = asyncHandler(async (req: Request, res: Response) => {
  const coaches = await Coach.find({}); // Find all coaches
  res.status(200).json({
    status: true,
    message: "Coaches fetched successfully.",
    count: coaches.length, // Include count for lists
    data: coaches,
  });
});

// @desc    Get single coach by ID
// @route   GET /api/coaches/:id
// @access  Public
export const getCoachById = asyncHandler(
  async (req: Request, res: Response) => {
    const coach = await Coach.findById(req.params.id); // Find coach by ID

    if (coach) {
      res.status(200).json({
        message: "Coach fetched successfully.",
        data: coach,
      });
    } else {
      res.status(404);
      throw new Error("Coach not found.");
    }
  }
);

// @desc    Update a coach
// @route   PUT /api/coaches/:id
// @access  Admin
export const updateCoach = asyncHandler(async (req: Request, res: Response) => {
  const { name, role, img, bio } = req.body;

  const coach = await Coach.findById(req.params.id); // Find coach to update

  if (coach) {
    // Update fields if they are provided in the request body, otherwise keep existing value
    coach.name = name || coach.name;
    coach.role = role || coach.role;
    coach.img = img || coach.img;
    coach.bio = bio !== undefined ? bio : coach.bio; // Allow bio to be explicitly set to null/undefined

    const updatedCoach = await coach.save(); // Save the updated coach
    res.status(200).json({
      message: "Coach updated successfully.",
      data: updatedCoach,
    });
  } else {
    res.status(404);
    throw new Error("Coach not found.");
  }
});

// @desc    Delete a coach
// @route   DELETE /api/coaches/:id
// @access  Admin
export const deleteCoach = asyncHandler(async (req: Request, res: Response) => {
  const coach = await Coach.findById(req.params.id); // Find coach to delete

  if (coach) {
    await Coach.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
    res.status(200).json({ message: "Coach removed successfully." });
  } else {
    res.status(404);
    throw new Error("Coach not found.");
  }
});

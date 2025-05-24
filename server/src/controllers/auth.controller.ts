import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
import mongoose from "mongoose";
import * as crypto from "crypto";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      res.status(400);
      throw new Error(
        "Please enter all required fields: username, email, password."
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User with this email already exists.");
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "public",
    });

    if (user) {
      const userId = user._id as mongoose.Types.ObjectId;
      res.status(201).json({
        message: "User registered successfully.",
        data: {
          _id: userId,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(userId.toString()),
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data.");
    }
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password as string))) {
    const userId = user._id as mongoose.Types.ObjectId;
    res.json({
      message: "Logged in successfully.",
      data: {
        _id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(userId.toString()),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials (email or password).");
  }
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user) {
      res.json({
        message: "User profile fetched successfully.",
        data: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({
        message:
          "If a user with that email exists, a password reset process has been initiated.",
        devOnly: {
          warning:
            "Token is returned directly for development/testing. In production, this would be sent via email.",
          tokenDetails: null,
        },
      });
      return;
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // FOR DEVELOPMENT/TESTING ONLY: Output the token to the console and response
    const resetURL_for_dev = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetpassword/${resetToken}`;
    console.log(`\n--- DEV ONLY: PASSWORD RESET TOKEN ---`);
    console.log(`For email: ${user.email}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Reset URL (PUT request): ${resetURL_for_dev}`);
    console.log(
      `Token expires: ${user.resetPasswordExpire?.toLocaleString()} (Thailand Time)`
    ); // Convert to local time for clarity
    console.log(`------------------------------------\n`);

    res.status(200).json({
      message:
        "Password reset request processed. Check server logs or response for token (Development Mode).",
      devOnly: {
        warning:
          "Token is returned directly for development/testing. In production, this would be sent via email.",
        resetToken: resetToken,
        resetURL: resetURL_for_dev,
      },
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;

    // Hash the token from the URL parameter to compare it with the hashed token stored in the database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find the user by the hashed token and ensure the token is not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // $gt: greater than (token expiration time > current time)
    });

    if (!user) {
      res.status(400); // Bad Request
      throw new Error("Invalid or expired password reset token.");
    }

    // Update the user's password (the pre-save hook in the User model will hash it)
    user.password = password;
    user.resetPasswordToken = undefined; // Clear the token after successful use
    user.resetPasswordExpire = undefined; // Clear the expiration time

    await user.save(); // Save the user with the new hashed password

    // Optionally, log the user in immediately after resetting password
    const userId = user._id as mongoose.Types.ObjectId;
    res.status(200).json({
      message: "Password reset successful. You are now logged in.",
      data: {
        _id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(userId.toString()), // Issue a new JWT
      },
    });
  }
);

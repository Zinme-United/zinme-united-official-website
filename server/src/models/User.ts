// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Optional because it might be excluded in some queries
  role: "admin" | "editor" | "public";
  resetPasswordToken?: string; // New: Stores the hashed reset token
  resetPasswordExpire?: Date; // New: Stores the expiration date for the token
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string; // New: Method to generate a reset token
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default on queries for security
    },
    role: {
      type: String,
      enum: ["admin", "editor", "public"],
      default: "public",
    },
    resetPasswordToken: String, // Mongoose schema type
    resetPasswordExpire: Date, // Mongoose schema type
  },
  { timestamps: true }
);

// --- Mongoose Middleware (Pre-save hook for password hashing) ---
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// --- Mongoose Instance Methods ---
// Method to compare an entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

// Method to generate and set the password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate a random 20-byte hexadecimal string for the token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the `resetToken` (the one sent to the user) and store the HASHED version in the database.
  // This makes it so if your database is compromised, the plain-text reset token isn't exposed.
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the token's expiration time (e.g., 10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  // Return the UNHASHED token, as this is what will be sent to the user (e.g., in an email link).
  return resetToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

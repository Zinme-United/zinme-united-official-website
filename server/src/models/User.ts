import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: "admin" | "editor" | "public";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return the UNHASHED token, as this is what will be sent to the user (e.g., in an email link).
  return resetToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

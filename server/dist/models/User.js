"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// --- Mongoose Middleware (Pre-save hook for password hashing) ---
UserSchema.pre("save", async function (next) {
    // Only hash the password if it's new or has been modified
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// --- Mongoose Instance Methods ---
// Method to compare an entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
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
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;

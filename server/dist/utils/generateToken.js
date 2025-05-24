"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/generateToken.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * The token is signed with a secret from environment variables and expires in 1 hour.
 *
 * @param id The user's MongoDB ObjectId as a string.
 * @returns The generated JWT string.
 */
const generateToken = (id) => {
    // Ensure JWT_SECRET is defined in your .env file
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    // Sign the token with the user's ID as the payload, the secret, and an expiration time.
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token will expire 1 hour after creation
    });
};
exports.default = generateToken;

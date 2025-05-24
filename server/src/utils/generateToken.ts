// src/utils/generateToken.ts
import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * The token is signed with a secret from environment variables and expires in 1 hour.
 *
 * @param id The user's MongoDB ObjectId as a string.
 * @returns The generated JWT string.
 */
const generateToken = (id: string): string => {
  // Ensure JWT_SECRET is defined in your .env file
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  // Sign the token with the user's ID as the payload, the secret, and an expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token will expire 1 hour after creation
  });
};

export default generateToken;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = "1h";

  if (!jwtSecret || !jwtExpiresIn) {
    console.error(
      "JWT_SECRET or JWT_EXPIRES_IN is not defined in environment variables."
    );
    throw new Error("Server configuration error: JWT secret not found.");
  }

  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export default generateToken;

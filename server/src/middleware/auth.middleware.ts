// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User"; // Assuming User model path
import asyncHandler from "express-async-handler"; // For handling async errors gracefully

// Extend the Request interface to include a 'user' property
// This allows you to access req.user in your controllers after authentication
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * @desc Protects routes by verifying JWT
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header (e.g., "Bearer TOKEN_STRING")
        token = req.headers.authorization.split(" ")[1];

        // Verify token using the JWT_SECRET from .env
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );

        // Find the user by ID from the decoded token
        // .select('-password') excludes the password hash from the user object
        req.user = await User.findById(decoded.id).select("-password");

        // If user not found (e.g., user deleted but token still valid)
        if (!req.user) {
          res.status(401); // Unauthorized
          throw new Error("Not authorized, user not found");
        }

        next(); // Proceed to the next middleware/controller
      } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401); // Unauthorized
        throw new Error("Not authorized, token failed");
      }
    }

    // If no token is provided in the header
    if (!token) {
      res.status(401); // Unauthorized
      throw new Error("Not authorized, no token");
    }
  }
);

/**
 * @desc Authorizes roles for specific routes
 * @param roles Array of allowed roles (e.g., ['admin', 'editor'])
 */
const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated (req.user exists) and if their role is in the allowed roles array
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `User role (${
          req.user?.role || "unknown"
        }) is not authorized to access this route.`
      );
    }
    next(); // Proceed to the next middleware/controller
  };
};

export { protect, authorizeRoles };

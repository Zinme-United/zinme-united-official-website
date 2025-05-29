import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import asyncHandler from "express-async-handler";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        // Verify token using the JWT_SECRET from .env
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );

        req.user = await User.findById(decoded.id).select("-password");

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

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `User role (${
          req.user?.role || "unknown"
        }) is not authorized to access this route.`
      );
    }
    next();
  };
};

export { protect, authorizeRoles };

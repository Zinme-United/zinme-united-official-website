import { Request, Response, NextFunction } from "express";
import { BackendErrorResponse } from "../types";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // If Mongoose not found error
  if (
    err.name === "CastError" &&
    err.message.includes("Cast to ObjectId failed")
  ) {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    status: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  } as BackendErrorResponse); // Cast to BackendErrorResponse
};

export { notFound, errorHandler };

import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal Server Error",
  });
};

// Not Found Middleware for routes that don't exist
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new createError.NotFound("Resource not found"));
};

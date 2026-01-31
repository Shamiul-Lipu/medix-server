import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

// Custom error class for application errors
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorDetails = null;

  // Prisma Validation Error (e.g., wrong field types, missing required fields)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided. Please check your input fields.";
  }

  // Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        const field = (err.meta?.target as string[])?.join(", ") || "field";
        message = `${field} already exists. Please use a different value.`;
        break;

      case "P2003":
        // Foreign key constraint failed
        message = "Invalid reference. The related record does not exist.";
        break;

      case "P2025":
        // Record not found
        statusCode = 404;
        message = "Record not found.";
        break;

      case "P2014":
        // Required relation violation
        message = "Cannot delete record with existing dependencies.";
        break;

      default:
        message = "Database operation failed.";
    }
  }

  // Prisma Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unexpected database error occurred.";
  }

  // Prisma Initialization Error (connection issues)
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;

    if (err.errorCode === "P1000") {
      message = "Database authentication failed.";
    } else if (err.errorCode === "P1001") {
      message = "Cannot reach database server.";
    } else {
      message = "Database connection failed.";
    }
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }
  // Custom App Errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { errorDetails }),
  });
}

export default globalErrorHandler;

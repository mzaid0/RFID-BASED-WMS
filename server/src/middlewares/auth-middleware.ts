import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../utils/db.js";

// Custom Request type that includes the `user` property

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from cookies
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
      return;
    }

    // Ensure the JWT secret is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT secret is not defined in environment variables",
      });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    const user = await db.user.findUnique({
      where: { id: (decoded as any).userId },
    });

    req.user = user as User; // Attach user details to the request object with `User` type
    next(); // Continue to the next middleware or controller
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }
};

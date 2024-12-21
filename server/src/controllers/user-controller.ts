import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import db from "../utils/db.js";


// Set the absolute path for the uploads directory
const uploadDirectory = path.resolve(__dirname, "../../uploads");

// Configure multer to use the absolute path
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, warehouseAddress, ...otherDetails } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        message: "Password is required",
      });
      return;
    }

    // Check if the user already exists
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const profilePicture = req.file ? req.file.filename : null;

    console.log(req.file);

    // Prepare the data to create the user
    const userData: any = {
      email,
      password: hashedPassword,
      profilePicture,
      warehouseAddress, // Spread other dynamic fields from the request body
      ...otherDetails,
    };

    // Save the new user with the hashed password
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        profilePicture: profilePicture,
        warehouseId: req.user?.warehouseId,
        firstName: req.body?.firstName,
        lastName: req.body.lastName,
        role: "Manager",
      }, // Pass the prepared user data
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await db.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        warehouse: {
          select: {
            warehouseAddress: true,
          },
        },
      },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    if (
      req.body.warehouseAddress !== existingUser.warehouse?.warehouseAddress
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    delete (existingUser as any)?.password;
    // Send success response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  try {
    // Clear the authToken cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await db.user.findMany({
      select: {
        email: true,
        profilePicture: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

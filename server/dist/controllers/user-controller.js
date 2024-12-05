import db from "../utils/db.js";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import { fileURLToPath } from "url";
// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set the absolute path for the uploads directory
const uploadDirectory = path.resolve(__dirname, "../../uploads");
// Configure multer to use the absolute path
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDirectory);
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
        },
    }),
});
export const registerUser = async (req, res) => {
    try {
        const { email, password, ...otherDetails } = req.body;
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
        // Define salt rounds and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Check if profile image is uploaded
        const profilePicture = req.file ? req.file.filename : null;
        console.log(req.file);
        // Prepare the data to create the user
        const userData = {
            email,
            password: hashedPassword,
            profilePicture,
            ...otherDetails, // Spread other dynamic fields from the request body
        };
        // Save the new user with the hashed password
        const newUser = await db.user.create({
            data: userData, // Pass the prepared user data
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const existingUser = await db.user.findFirst({
            where: { email },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        // Generate a JWT token
        const token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Set the JWT token as a cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        delete existingUser?.password;
        // Send success response
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: existingUser,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const logoutUser = (req, res) => {
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
// Get all users
export const getAllUsers = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

import { Request, Response } from "express";
import db from "../../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
                lastName: true,
                firstName: true,
                role: true,
                profilePicture: true,
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
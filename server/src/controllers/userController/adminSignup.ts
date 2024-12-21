import { Request, Response } from "express";
import db from "../../utils/db";
import bcrypt from "bcrypt";


export const adminSignup = async (req: Request, res: Response) => {
    try {

        const saltRounds = 10;
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const profilePicture = req.file ? req.file.filename : null;

        const existingUser = await db.user.create({
            data: {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword,
                role: "Admin",
                profilePicture: profilePicture

            }
        });
        res.status(200).json({ message: "Reader already disconnected." })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
        console.log(`error occurred while signing up admin:${error}`)
    }
}
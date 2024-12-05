// routes/userRoutes.js
import { Router } from "express";
import { getAllUsers, loginUser, logoutUser, registerUser, upload, } from "../controllers/user-controller.js";
const router = Router();
// Use the uploadSingle middleware for the /register route
router.route("/register").post(upload.single("profilePicture"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/users").get(getAllUsers);
export default router;

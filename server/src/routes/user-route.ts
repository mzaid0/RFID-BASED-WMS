// routes/userRoutes.js
import { Router } from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  upload,
} from "../controllers/user-controller.js";
import { isAuthenticated } from "../middlewares/auth-middleware.js";
import { authorizeRoles } from "../middlewares/role-middleware.js";
const router = Router();

// Use the uploadSingle middleware for the /register route
router.route("/register").post(upload.single("profilePicture"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router
  .route("/users")
  .get(isAuthenticated, authorizeRoles(["Admin"]), getAllUsers);

export default router;

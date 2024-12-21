// routes/userRoutes.js
import { Router } from "express";
import {
  getAllUsers,
  logoutUser,
  registerUser,
  upload,
} from "../controllers/user-controller.js";
import { isAuthenticated } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";
import { adminSignup } from "../controllers/userController/adminSignup";
import { loginUser } from "../controllers/userController/loginUser";
const userRouter = Router();

// Use the uploadSingle middleware for the /register route
userRouter.route("/register").post(upload.single("profilePicture"), registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(logoutUser);

userRouter.route("/admin-signup").post(adminSignup);

userRouter
  .route("/users")
  .get(isAuthenticated, authorizeRoles(["Admin", "Manager"]), getAllUsers);

export default userRouter;

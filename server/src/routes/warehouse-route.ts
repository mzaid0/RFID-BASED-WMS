import express from "express";
import { addWarehouse } from "../controllers/warehouse-controller";
import { isAuthenticated } from "../middlewares/auth-middleware";
import { authorizeRoles } from "../middlewares/role-middleware";

const router = express.Router();

// Route for creating warehouse
router.post("/add", isAuthenticated, authorizeRoles(["Admin",]), addWarehouse);

export default router;

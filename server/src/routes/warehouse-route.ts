import express from "express";
import { createWarehouse } from "../controllers/warehouse-controller.js";

const router = express.Router();

// Route for creating warehouse
router.post("/add", createWarehouse);

export default router;

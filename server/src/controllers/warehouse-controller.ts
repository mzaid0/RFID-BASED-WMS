import { Request, Response } from "express";
import db from "../utils/db.js"; // Create a new Warehouse
export const createWarehouse = async (req: Request, res: Response) => {
  const { warehouseName, warehouseAddress } = req.body;

  try {
    // Validate input
    if (!warehouseName || !warehouseAddress) {
      res.status(400).json({
        success: false,
        message: "Warehouse name and address are required",
      });
      return;
    }

    // Create warehouse
    const newWarehouse = await db.warehouse.create({
      data: {
        warehouseName,
        warehouseAddress,
      },
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: newWarehouse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the warehouse",
    });
    return;
  }
};
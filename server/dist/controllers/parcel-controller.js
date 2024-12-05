import db from "../utils/db.js";
export const createParcel = async (req, res) => {
    try {
        const parcelDetails = req.body;
        // Ensure parcelDate is in ISO format
        if (parcelDetails.parcelDate) {
            const formattedDate = new Date(parcelDetails.parcelDate);
            if (!isNaN(formattedDate.getTime())) {
                parcelDetails.parcelDate = formattedDate.toISOString();
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Invalid date format for parcelDate. Please use a valid date.",
                });
                return; // Ensure the function exits after sending a response
            }
        }
        // Convert parcelWeight to float
        if (parcelDetails.parcelWeight) {
            const weight = parseFloat(parcelDetails.parcelWeight);
            if (isNaN(weight) || weight <= 0) {
                res.status(400).json({
                    success: false,
                    message: "Invalid weight for parcelWeight. Please provide a valid positive number.",
                });
                return; // Ensure the function exits after sending a response
            }
            parcelDetails.parcelWeight = weight; // Store weight as a float
        }
        // If no status is provided, set it to "Pending"
        if (!parcelDetails.status) {
            parcelDetails.status = "Pending";
        }
        // Create parcel in the database
        await db.parcelDetails.create({
            data: parcelDetails,
        });
        res.status(201).json({
            success: true,
            message: "Parcel created successfully",
        });
    }
    catch (error) {
        console.error("Error creating parcel:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create parcel",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const allParcels = async (req, res) => {
    try {
        const parcels = await db.parcelDetails.findMany();
        if (parcels.length === 0) {
            res.status(200).json({
                success: true,
                message: "No parcels found in the database",
                parcels: [],
            });
        }
        else {
            res.status(200).json({
                success: true,
                parcels,
            });
        }
    }
    catch (error) {
        console.error("Error retrieving parcels:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve parcels",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const singleParcel = async (req, res) => {
    try {
        const { id } = req.params;
        const parcel = await db.parcelDetails.findUnique({
            where: { id },
        });
        if (!parcel) {
            res.status(404).json({
                success: false,
                message: "Parcel not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                parcel,
            });
        }
    }
    catch (error) {
        console.error("Error retrieving parcel:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve parcel",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const updateParcel = async (req, res) => {
    try {
        const { id } = req.params;
        const parcelDetails = req.body;
        // Check if the parcel exists
        const existingParcel = await db.parcelDetails.findUnique({
            where: { id },
        });
        if (!existingParcel) {
            res.status(404).json({
                success: false,
                message: "Parcel not found",
            });
            return;
        }
        // Ensure parcelDate is in ISO format
        if (parcelDetails.parcelDate) {
            const formattedDate = new Date(parcelDetails.parcelDate);
            if (!isNaN(formattedDate.getTime())) {
                parcelDetails.parcelDate = formattedDate.toISOString();
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Invalid date format for parcelDate. Please use a valid date.",
                });
                return;
            }
        }
        // Convert parcelWeight to float
        if (parcelDetails.parcelWeight) {
            const weight = parseFloat(parcelDetails.parcelWeight);
            if (isNaN(weight) || weight <= 0) {
                res.status(400).json({
                    success: false,
                    message: "Invalid weight for parcelWeight. Please provide a valid positive number.",
                });
                return;
            }
            parcelDetails.parcelWeight = weight; // Store weight as a float
        }
        // If no status is provided, keep the existing status
        if (!parcelDetails.status) {
            parcelDetails.status = existingParcel.status;
        }
        // Update the parcel in the database
        await db.parcelDetails.update({
            where: { id },
            data: parcelDetails,
        });
        res.status(200).json({
            success: true,
            message: "Parcel updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating parcel:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update parcel",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const updateParcelStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the parcel by ID
        const existingParcel = await db.parcelDetails.findUnique({
            where: { id },
        });
        if (!existingParcel) {
            res.status(404).json({
                success: false,
                message: "Parcel not found",
            });
            return; // Ensure no further code executes after response
        }
        // Update the status based on current status
        if (existingParcel.status === "Pending") {
            await db.parcelDetails.update({
                where: { id },
                data: { status: "Dispatched" },
            });
            res.status(200).json({
                success: true,
                message: "Parcel status updated to Dispatched successfully",
            });
        }
        else if (existingParcel.status === "Dispatched") {
            await db.parcelDetails.update({
                where: { id },
                data: { status: "Delivered" },
            });
            res.status(200).json({
                success: true,
                message: "Parcel status updated to Delivered successfully",
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Parcel is already in Delivered status or cannot be updated further.",
            });
        }
    }
    catch (error) {
        console.error("Error updating parcel status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update parcel status",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
export const deleteParcel = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the parcel exists
        const existingParcel = await db.parcelDetails.findUnique({
            where: { id },
        });
        if (!existingParcel) {
            res.status(404).json({
                success: false,
                message: "Parcel not found",
            });
            return; // Stop further execution if parcel not found
        }
        // Delete the parcel from the database
        await db.parcelDetails.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Parcel deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting parcel:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete parcel",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

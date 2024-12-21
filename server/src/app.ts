import express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 4000;

// Define the uploads directory path
const uploadDirectory = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Serve static files from the uploads directory
app.use(express.static("uploads"));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);

// Import routes for handling parcel and user requests
import parcelRoute from "./routes/parcel-route.js";
import userRoute from "./routes/user-route.js";
import warehouseRoute from "./routes/warehouse-route.js";

// Use the imported routes to handle requests
app.use("/api/v1/parcel", parcelRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/warehouse", warehouseRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

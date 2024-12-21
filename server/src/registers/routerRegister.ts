import { Express } from "express";
// Import routes for handling parcel and user requests
import parcelRoute from "../routes/parcel-route";
import userRoute from "../routes/user-route";
import warehouseRoute from "../routes/warehouse-route";


export default function registerRoutes(app: Express) {

    // Use the imported routes to handle requests
    app.use("/api/v1/parcel", parcelRoute);
    app.use("/api/v1/user", userRoute);
    app.use("/api/v1/warehouse", warehouseRoute);



}

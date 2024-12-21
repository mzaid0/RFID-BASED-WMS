import express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io"
import http from "http"
import registerRoutes from "./registers/routerRegister";



config({ path: ".env" });

const app = express();

registerRoutes(app)


const corsConfig = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
}


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

app.use(cors(corsConfig));

const httpServer = http.createServer(app);

const socketIo = new SocketServer(httpServer, { cors: corsConfig });


httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

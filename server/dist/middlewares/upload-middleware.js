// middlewares/uploadMiddleware.ts
import multer from "multer";
import path from "path";
// Configure Multer storage with TypeScript types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
// Multer middleware for single file upload
const upload = multer({ storage });
// Export the middleware for use in routes
export const uploadSingle = upload.single("profilePicture");

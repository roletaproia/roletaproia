import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "dist", "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory first

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function processAndSaveAvatar(
  file: Express.Multer.File,
  userId: string
): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    // Generate unique filename
    const filename = `${userId}-${uuidv4()}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with sharp
    // - Resize to 200x200
    // - Convert to WebP for better compression
    // - Strip metadata for privacy
    await sharp(file.buffer)
      .resize(200, 200, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Return the URL path (relative to public directory)
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error processing avatar:", error);
    throw new Error("Failed to process image");
  }
}

export function deleteAvatar(avatarUrl: string): void {
  try {
    if (!avatarUrl) return;

    // Extract filename from URL
    const filename = path.basename(avatarUrl);
    const filepath = path.join(uploadsDir, filename);

    // Check if file exists and delete it
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    console.error("Error deleting avatar:", error);
    // Don't throw, just log the error
  }
}


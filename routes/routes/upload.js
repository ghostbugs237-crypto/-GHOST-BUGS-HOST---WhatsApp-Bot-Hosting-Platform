
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const uploadDirectory = path.resolve("uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const safeName = `${Date.now()}-${req.user.id}.zip`;
    callback(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (path.extname(file.originalname).toLowerCase() !== ".zip") {
      return callback(new Error("Only ZIP files are allowed"));
    }

    callback(null, true);
  }
});

router.post(
  "/",
  authenticateUser,
  upload.single("botFile"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a ZIP file"
      });
    }

    res.status(201).json({
      success: true,
      message: "ZIP uploaded successfully. Deployment is not enabled yet.",
      file: {
        name: req.file.filename,
        size: req.file.size
      }
    });
  }
);

export default router;

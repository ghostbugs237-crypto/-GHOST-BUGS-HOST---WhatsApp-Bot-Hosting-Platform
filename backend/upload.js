
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

const router = express.Router();

const uploadDir = path.resolve("uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(null, `${randomUUID()}.zip`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const isZip = path.extname(file.originalname).toLowerCase() === ".zip";

        if (!isZip) {
            return cb(new Error("Only ZIP files are allowed."));
        }

        cb(null, true);
    }
});

router.post("/upload", (req, res) => {
    upload.single("botFile")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please select a ZIP file."
            });
        }

        const botName = String(req.body.botName || "").trim();

        if (!botName || botName.length > 60) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message: "Bot name is required (maximum 60 characters)."
            });
        }

        return res.status(201).json({
            message: "Bot ZIP uploaded successfully!",
            botName,
            fileId: path.basename(req.file.filename)
        });
    });
});

export default router;
  

import express from "express";
import multer from "multer";
import { saveFile } from "../module/localStorage";

const router = express.Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Upload multiple files
 * POST /upload/multiple
 * Form data: files (multiple), directory (string)
 */
router.post("/multiple", upload.array("files", 10), async (req, res) => {
  try {
    const { directory } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!directory) {
      return res.status(400).json({ message: "Missing directory parameter" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const url = await saveFile(file.buffer, file.originalname, directory);
      uploadedUrls.push(url);
    }

    res.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: String(error) });
  }
});

/**
 * Upload single file
 * POST /upload/single
 * Form data: file, directory (string), fileName (optional)
 */
router.post("/single", upload.single("file"), async (req, res) => {
  try {
    const { directory, fileName } = req.body;
    const file = req.file;

    if (!file || !directory) {
      return res.status(400).json({ message: "Missing file or directory parameter" });
    }

    const finalFileName = fileName || file.originalname;
    const url = await saveFile(file.buffer, finalFileName, directory);

    res.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: String(error) });
  }
});

export default router;

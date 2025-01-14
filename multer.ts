import multer from "multer";
import config from "./config";
import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

const imageStorage = multer.diskStorage({
  destination: async (req, res, cb) => {
    const destDir = path.join(config.publicPath, "image");
    await fs.mkdir(destDir, { recursive: true });
    cb(null, config.publicPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const newFilename = randomUUID() + extension;
    cb(null, "image/" + newFilename);
  },
});

export const imageUpload = multer({ storage: imageStorage });

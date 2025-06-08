import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

type UploadType = "profil" | "presensi";

const createUploadDir = (folder: UploadType): string => {
  const uploadDir = path.resolve(__dirname, `../../uploads/${folder}`);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipe file tidak didukung. Hanya JPG, PNG, atau WEBP."));
  }
};

const createMulterUpload = (folder: UploadType) =>
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        const uploadDir = createUploadDir(folder);
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${folder}-${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

export const uploadProfil = createMulterUpload("profil");
export const uploadPresensi = createMulterUpload("presensi");

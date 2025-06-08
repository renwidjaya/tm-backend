import fs from "fs";
import path from "path";

/**
 * Mengirim file upload dari folder tertentu ke response
 * @param res - Express Response
 * @param folder - Nama folder ('profil', 'presensi', dst.)
 * @param filename - Nama file yang ingin diambil
 */
export const readUploadedFile = (folder: string, filename: string): string => {
  const filePath = path.resolve(__dirname, `../../uploads/${folder}`, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filename} tidak ditemukan di ${folder}`);
  }

  return filePath;
};

import { Op } from "sequelize";
import { httpCode } from "@utils/prefix";
import { Karyawan, Presensi } from "@models/index";
import CustomError from "@middlewares/error-handler";
import { NextFunction, Request, Response } from "express";

/**
 * Get All Karyawan
 * @param req
 * @param res
 * @param next
 */
const getAllKaryawan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const data = await Karyawan.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).json({ message: "Success", data });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Presensi
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getAllPresensi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bulan, limit = 10, offset = 0 } = req.query;

    if (!bulan) {
      throw new CustomError(httpCode.badRequest, "Bulan wajib diisi");
    }

    const startDate = new Date(`${bulan}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // bulan berikutnya

    const data = await Karyawan.findAll({
      include: [
        {
          model: Presensi,
          as: "presensis",
          where: {
            tanggal: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
          required: true,
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).json({ message: "Success", data });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Detail Presensi karyawan
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getDetailPresensi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const karyawan = await Karyawan.findOne({
      where: { id_karyawan: id },
      include: [
        {
          model: Presensi,
          as: "presensis", // pakai lowercase, sesuai relasi
        },
      ],
    });

    if (!karyawan) {
      throw new CustomError(httpCode.notFound, "Karyawan tidak ditemukan");
    }

    res.status(200).json({
      message: "Success",
      data: karyawan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Presensi
 * @param req
 * @param res
 * @param next
 */
const createPresensi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      id_karyawan,
      tanggal,
      jam_masuk,
      jam_pulang,
      lokasi_masuk,
      lokasi_pulang,
      foto_masuk,
      foto_pulang,
      total_jam_lembur,
      kategori,
    } = req.body;

    const karyawan = await Karyawan.findByPk(id_karyawan);
    if (!karyawan) {
      throw new CustomError(httpCode.badRequest, "Karyawan tidak ditemukan");
    }

    const data = await Presensi.create({
      id_karyawan,
      tanggal,
      jam_masuk,
      jam_pulang,
      lokasi_masuk,
      lokasi_pulang,
      foto_masuk,
      foto_pulang,
      total_jam_lembur,
      kategori,
    });

    res.status(201).json({ message: "Presensi berhasil ditambahkan", data });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Presensi
 * @param req
 * @param res
 * @param next
 * @returns
 */
const updatePresensi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const presensi = await Presensi.findByPk(id);
    if (!presensi) {
      throw new CustomError(httpCode.notFound, "Data presensi tidak ditemukan");
    }

    const {
      tanggal,
      jam_masuk,
      jam_pulang,
      lokasi_masuk,
      lokasi_pulang,
      foto_masuk,
      foto_pulang,
      total_jam_lembur,
      kategori,
    } = req.body;

    await presensi.update({
      tanggal,
      jam_masuk,
      jam_pulang,
      lokasi_masuk,
      lokasi_pulang,
      foto_masuk,
      foto_pulang,
      total_jam_lembur,
      kategori,
    });

    res.status(200).json({
      message: "Data presensi berhasil diperbarui",
      data: presensi,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Presensi
 * @param req
 * @param res
 * @param next
 * @returns
 */
const deletePresensi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Presensi.destroy({
      where: { id_absensi: id },
    });

    if (deleted === 0) {
      throw new CustomError(httpCode.notFound, "Data tidak ditemukan");
    }

    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllKaryawan,
  getAllPresensi,
  getDetailPresensi,
  createPresensi,
  updatePresensi,
  deletePresensi,
};

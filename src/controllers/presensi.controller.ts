import fs from "fs";
import { Workbook } from "exceljs";
import { httpCode } from "@utils/prefix";
import { col, fn, Op, where } from "sequelize";
import { readUploadedFile } from "@utils/files";
import CustomError from "@middlewares/error-handler";
import { Karyawan, Presensi, User } from "@models/index";
import { NextFunction, Request, Response } from "express";
import { EnumKategoriPresensi } from "@models/presensi.model";
import { uploadToFirebase } from "@utils/upload-to-firebase";

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
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "role"], // ambil yang diperlukan saja
        },
      ],
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
    const { tahunbulan } = req.body;

    if (
      !tahunbulan ||
      typeof tahunbulan !== "string" ||
      !tahunbulan.match(/^\d{4}-\d{2}$/)
    ) {
      throw new CustomError(
        httpCode.badRequest,
        "Format tahunbulan tidak valid (YYYY-MM)"
      );
    }

    const [tahun, bulanAngka] = tahunbulan.split("-").map(Number);

    const data = await Karyawan.findAll({
      include: [
        {
          model: Presensi,
          as: "presensis",
          where: {
            [Op.and]: [
              where(fn("MONTH", col("presensis.tanggal")), bulanAngka),
              where(fn("YEAR", col("presensis.tanggal")), tahun),
            ],
          },
          required: false,
        },
      ],
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

    const now = new Date();
    const bulan = now.getMonth() + 1; // 0-based index
    const tahun = now.getFullYear();

    const karyawan = await Karyawan.findOne({
      where: { id_karyawan: id },
      include: [
        {
          model: Presensi,
          as: "presensis",
          where: {
            [Op.and]: [
              where(fn("MONTH", col("presensis.tanggal")), bulan),
              where(fn("YEAR", col("presensis.tanggal")), tahun),
            ],
          },
          required: false,
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
    const { id_karyawan, tanggal, jam_masuk, lokasi_masuk, kategori } =
      req.body;

    const karyawan = await Karyawan.findByPk(id_karyawan);
    if (!karyawan) {
      throw new CustomError(httpCode.badRequest, "Karyawan tidak ditemukan");
    }

    const existing = await Presensi.findOne({
      where: { id_karyawan, tanggal },
    });

    if (existing) {
      throw new CustomError(
        httpCode.badRequest,
        "Karyawan sudah absen hari ini"
      );
    }

    if (!req.file?.path) {
      throw new CustomError(httpCode.badRequest, "Foto masuk wajib diunggah");
    }

    const uploadedUrl = await uploadToFirebase(req.file.path, "presensi");

    // Hapus file lokal setelah di-upload
    fs.unlinkSync(req.file.path);

    const data = await Presensi.create({
      id_karyawan,
      tanggal,
      jam_masuk,
      lokasi_masuk,
      foto_masuk: uploadedUrl,
      kategori,
    });

    res.status(201).json({ message: "Absen masuk berhasil", data });
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
    const { jam_pulang, lokasi_pulang, total_jam_lembur } = req.body;
    const { id_presensi } = req.params;

    const presensi = await Presensi.findByPk(id_presensi);
    if (!presensi) {
      throw new CustomError(httpCode.notFound, "Presensi tidak ditemukan");
    }

    if (!req.file?.path) {
      throw new CustomError(httpCode.badRequest, "Foto pulang wajib diunggah");
    }

    const uploadedUrl = await uploadToFirebase(req.file.path, "presensi");

    // Hapus file lokal setelah di-upload
    fs.unlinkSync(req.file.path);

    await presensi.update({
      jam_pulang,
      lokasi_pulang,
      foto_pulang: uploadedUrl,
      total_jam_lembur,
    });

    res.status(200).json({ message: "Absen pulang berhasil", data: presensi });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Presensi Detail
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getPresensiDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_karyawan, tanggal } = req.body;

    if (!id_karyawan || !tanggal) {
      throw new CustomError(
        httpCode.badRequest,
        "ID karyawan dan tanggal wajib diisi"
      );
    }

    const presensi = await Presensi.findOne({
      where: {
        id_karyawan: Number(id_karyawan),
        tanggal: String(tanggal),
      },
    });

    if (!presensi) {
      res.status(404).json({ message: "Presensi tidak ditemukan" });
      return;
    }

    res
      .status(200)
      .json({ message: "Detail presensi ditemukan", data: presensi });
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

/**
 * Get Presensi Statistik
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getPresensiStatistik = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_karyawan, tahunbulan } = req.body;

    if (!id_karyawan || !tahunbulan) {
      throw new CustomError(
        httpCode.badRequest,
        "ID karyawan dan tahunbulan wajib diisi"
      );
    }

    if (!tahunbulan.match(/^\d{4}-\d{2}$/)) {
      throw new CustomError(
        httpCode.badRequest,
        "Format tahunbulan harus YYYY-MM"
      );
    }

    const [tahun, bulanAngka] = tahunbulan.split("-").map(Number);

    const kategoriList = [
      "MASUK_KERJA",
      "IZIN_KERJA",
      "CUTI_KERJA",
      "DINAS_KERJA",
    ];

    const statistik: Record<string, number> = {};

    let totalHadir = 0;
    let totalTidakHadir = 0;
    let totalPresensi = 0;

    for (const kategori of kategoriList) {
      const count = await Presensi.count({
        where: {
          id_karyawan,
          kategori,
          [Op.and]: [
            where(fn("MONTH", col("tanggal")), bulanAngka),
            where(fn("YEAR", col("tanggal")), tahun),
          ],
        },
      });

      statistik[kategori] = count;
      totalPresensi += count;

      if (kategori === "MASUK_KERJA" || kategori === "DINAS_KERJA") {
        totalHadir += count;
      }

      if (kategori === "IZIN_KERJA" || kategori === "CUTI_KERJA") {
        totalTidakHadir += count;
      }
    }

    const totalHariDalamBulan = new Date(tahun, bulanAngka, 0).getDate(); // contoh: 30 untuk Juni
    const persentaseKehadiran = (
      (totalHadir / totalHariDalamBulan) *
      100
    ).toFixed(2);

    res.status(200).json({
      message: "Statistik berhasil diambil",
      data: {
        total_presensi: totalPresensi,
        total_hari_dalam_bulan: totalHariDalamBulan,
        total_hadir: totalHadir,
        total_tidak_hadir: totalTidakHadir,
        persentase_kehadiran: `${persentaseKehadiran}%`,
        per_kategori: statistik,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download Presensi Excel
 * @param req
 * @param res
 * @param next
 * @returns
 */
const downloadPresensiExcel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tahunbulan } = req.query;

    if (
      !tahunbulan ||
      typeof tahunbulan !== "string" ||
      !tahunbulan.match(/^\d{4}-\d{2}$/)
    ) {
      throw new CustomError(
        httpCode.badRequest,
        "Format tahunbulan tidak valid (YYYY-MM)"
      );
    }

    const [tahun, bulan] = tahunbulan.split("-").map(Number);

    const data = await Karyawan.findAll({
      include: [
        {
          model: Presensi,
          as: "presensis",
          where: {
            [Op.and]: [
              where(fn("MONTH", col("presensis.tanggal")), bulan),
              where(fn("YEAR", col("presensis.tanggal")), tahun),
            ],
          },
          required: false,
        },
      ],
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(
      `Presensi ${tahun}-${bulan.toString().padStart(2, "0")}`
    );

    // Header
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Karyawan", key: "nama_lengkap", width: 25 },
      { header: "NIP", key: "nip", width: 15 },
      { header: "Jabatan", key: "jabatan", width: 20 },
      { header: "Tanggal", key: "tanggal", width: 15 },
      { header: "Jam Masuk", key: "jam_masuk", width: 12 },
      { header: "Jam Pulang", key: "jam_pulang", width: 12 },
      { header: "Kategori", key: "kategori", width: 18 },
    ];

    // Data Rows
    let index = 1;
    data.forEach((karyawan) => {
      karyawan.presensis?.forEach((presensi: Presensi) => {
        worksheet.addRow({
          no: index++,
          nama_lengkap: karyawan.nama_lengkap,
          nip: karyawan.nip,
          jabatan: karyawan.jabatan,
          tanggal: presensi.tanggal,
          jam_masuk: presensi.jam_masuk,
          jam_pulang: presensi.jam_pulang,
          kategori: presensi.kategori,
        });
      });
    });

    // Send response as Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Presensi-${tahun}-${bulan}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReportAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dayLabels = ["S", "S", "R", "K", "J", "S", "M"]; // Senin→Minggu

    const { tahunbulan } = req.query as { tahunbulan?: string };
    if (
      !tahunbulan ||
      typeof tahunbulan !== "string" ||
      !tahunbulan.match(/^\d{4}-\d{2}$/)
    ) {
      throw new CustomError(
        httpCode.badRequest,
        "Format tahunbulan tidak valid (YYYY-MM)"
      );
    }

    const [year, month] = tahunbulan.split("-").map(Number);

    // ambil semua karyawan + presensi MASUK_KERJA di bulan itu
    const karyawans = await Karyawan.findAll({
      include: [
        {
          model: Presensi,
          as: "presensis",
          where: {
            kategori: EnumKategoriPresensi.MASUK_KERJA,
            [Op.and]: [
              where(fn("MONTH", col("presensis.tanggal")), month),
              where(fn("YEAR", col("presensis.tanggal")), year),
            ],
          },
          required: false,
        },
      ],
    });

    // inisialisasi counter per hari (0=Senin ...6=Minggu)
    const counts = [0, 0, 0, 0, 0, 0, 0];

    // loop tiap presensi dari tiap karyawan
    karyawans.forEach((k) => {
      k.presensis?.forEach((p) => {
        // DATEONLY jadi string, kita parse ke Date
        const date = new Date(p.tanggal as any);
        const jsDay = date.getDay(); // 0=Sun..6=Sat
        const idx = jsDay === 0 ? 6 : jsDay - 1; // shift → 0=Mon..6=Sun
        counts[idx]++;
      });
    });

    // bangun payload chart
    const chart = counts.map((c, i) => ({
      label: dayLabels[i],
      count: c,
    }));

    res.json({
      message: "Report semua karyawan berhasil diambil",
      data: {
        periode: tahunbulan,
        chart,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfilPhoto = (req: Request, res: Response): void => {
  const filename = readUploadedFile("profil", req.params.filename);
  res.sendFile(filename);
};

const getPresensiPhoto = (req: Request, res: Response): void => {
  const filename = readUploadedFile("presensi", req.params.filename);
  res.sendFile(filename);
};

const getDashboardStatistik = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = new Date();
    const tahun = today.getFullYear();
    const bulan = today.getMonth() + 1; // 0-based
    const tanggalHariIni = today.toISOString().split("T")[0];

    const totalKaryawan = await Karyawan.count();

    const hadirHariIni = await Presensi.count({
      where: {
        tanggal: tanggalHariIni,
        kategori: {
          [Op.in]: ["MASUK_KERJA", "DINAS_KERJA"],
        },
      },
    });

    const hadirBulanIni = await Presensi.count({
      where: {
        [Op.and]: [
          where(fn("MONTH", col("tanggal")), bulan),
          where(fn("YEAR", col("tanggal")), tahun),
        ],
        kategori: {
          [Op.in]: ["MASUK_KERJA", "DINAS_KERJA"],
        },
      },
    });

    // Ambil jumlah hari dalam bulan ini
    const daysInMonth = new Date(tahun, bulan, 0).getDate();
    const grafikBulanan: number[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const count = await Presensi.count({
        where: {
          [Op.and]: [
            where(fn("DAY", col("tanggal")), i),
            where(fn("MONTH", col("tanggal")), bulan),
            where(fn("YEAR", col("tanggal")), tahun),
          ],
          kategori: {
            [Op.in]: ["MASUK_KERJA", "DINAS_KERJA"],
          },
        },
      });
      grafikBulanan.push(count);
    }

    // Grafik Mingguan: 7 hari terakhir
    const grafikMingguan: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const tanggal = d.toISOString().split("T")[0];

      const count = await Presensi.count({
        where: {
          tanggal,
          kategori: {
            [Op.in]: ["MASUK_KERJA", "DINAS_KERJA"],
          },
        },
      });

      grafikMingguan.push(count);
    }

    res.status(200).json({
      message: "Statistik dashboard berhasil diambil",
      data: {
        total_karyawan: totalKaryawan,
        hadir_hari_ini: hadirHariIni,
        hadir_bulan_ini: hadirBulanIni,
        periode: `01/${bulan
          .toString()
          .padStart(2, "0")}/${tahun} — ${daysInMonth}/${bulan
          .toString()
          .padStart(2, "0")}/${tahun}`,
        grafik_bulanan: grafikBulanan,
        grafik_mingguan: grafikMingguan,
      },
    });
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
  getPresensiDetail,
  deletePresensi,
  getPresensiStatistik,
  getMonthlyReportAll,
  downloadPresensiExcel,
  getProfilPhoto,
  getPresensiPhoto,
  getDashboardStatistik,
};

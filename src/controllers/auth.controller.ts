import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@configs/database";
import {
  deleteFromFirebase,
  uploadToFirebase,
} from "@utils/upload-to-firebase";
import User from "@models/user.model";
import Karyawan from "@models/karyawan.model";
import { NextFunction, Request, Response } from "express";

/**
 * Login
 * @param req
 * @param res
 * @param next
 * @returns
 */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const found = await User.findOne({ where: { email } });

    if (!found) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }

    const user = found.get();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Password salah" });
      return;
    }

    // Ambil data karyawan
    const karyawan = await Karyawan.findOne({
      where: { id_user: user.id_user },
    });

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.SECRET_KEY!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      data: {
        id_user: user.id_user,
        id_karyawan: karyawan?.id_karyawan,
        nama: user.nama,
        email: user.email,
        role: user.role,
        ...(karyawan && {
          nip: karyawan.nip,
          jabatan: karyawan.jabatan,
          alamat_lengkap: karyawan.alamat_lengkap,
          image_profil: karyawan.image_profil,
        }),
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Register
 * @param req
 * @param res
 * @param next
 * @returns
 */
const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { nama, email, password, role, nip, jabatan, alamat_lengkap } =
    req.body;

  const t = await db.transaction();

  try {
    const existing = await User.findOne({ where: { email }, transaction: t });
    if (existing) {
      await t.rollback();
      res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const image_profil = req.file?.path
      ? await uploadToFirebase(req.file.path, "profil")
      : undefined;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      { nama, email, password: hash, role },
      { transaction: t }
    );

    await Karyawan.create(
      {
        id_user: newUser.id_user,
        nama_lengkap: nama,
        nip,
        jabatan,
        alamat_lengkap,
        image_profil,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "User dan karyawan berhasil dibuat",
      user: newUser,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Edit User
 * @param req
 * @param res
 * @param next
 * @returns
 */
const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id_user } = req.params;
  const { nama, email, password, role, nip, jabatan, alamat_lengkap } =
    req.body;

  const t = await db.transaction();

  try {
    const user = await User.findByPk(id_user, { transaction: t });
    if (!user) {
      await t.rollback();
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    // Cek apakah email berubah dan sudah terpakai
    if (email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email },
        transaction: t,
      });
      if (existingEmail) {
        await t.rollback();
        res.status(400).json({ message: "Email sudah digunakan." });
        return;
      }
    }

    // Update user
    user.nama = nama;
    user.email = email;
    user.role = role;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }
    await user.save({ transaction: t });

    // Update karyawan
    const karyawan = await Karyawan.findOne({
      where: { id_user },
      transaction: t,
    });
    if (karyawan) {
      karyawan.nama_lengkap = nama;
      karyawan.nip = nip;
      karyawan.jabatan = jabatan;
      karyawan.alamat_lengkap = alamat_lengkap;

      // Proses upload jika ada file baru
      if (req.file?.path) {
        try {
          if (karyawan.image_profil) {
            await deleteFromFirebase(karyawan.image_profil);
          }
        } catch (err: any) {
          console.warn("Gagal hapus file lama dari Firebase:", err.message);
        }

        const newUrl = await uploadToFirebase(req.file.path, "profil");
        karyawan.image_profil = newUrl;
      }

      await karyawan.save({ transaction: t });
    }

    await t.commit();

    res.status(200).json({ message: "Data berhasil diperbarui", user });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Get User Detail
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id_user } = req.params;

  try {
    const user = await User.findByPk(id_user, {
      attributes: { exclude: ["password"] }, // jangan tampilkan password
      include: [
        {
          model: Karyawan,
          as: "karyawan", // sesuaikan dengan alias relasi di model
        },
      ],
    });

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * Destroy User
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const destroyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id_user } = req.params;

  const t = await db.transaction();

  try {
    const user = await User.findByPk(id_user, { transaction: t });
    if (!user) {
      await t.rollback();
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    const karyawan = await Karyawan.findOne({
      where: { id_user },
      transaction: t,
    });

    // Hapus gambar profil jika ada
    if (karyawan?.image_profil) {
      try {
        await deleteFromFirebase(karyawan.image_profil);
      } catch (err: any) {
        console.warn("Gagal hapus file dari Firebase:", err.message);
      }
    }

    // Hapus data karyawan jika ada
    if (karyawan) {
      await karyawan.destroy({ transaction: t });
    }

    // Hapus data user
    await user.destroy({ transaction: t });

    await t.commit();
    res.status(200).json({ message: "User berhasil dihapus." });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export default {
  login,
  register,
  editUser,
  getUserDetail,
  destroyUser,
};

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@configs/database";
import Karyawan from "@models/karyawan.model";
import { NextFunction, Request, Response } from "express";
import User, { IUserAttributes } from "@models/user.model";

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

    const user = found.get() as IUserAttributes;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Password salah" });
      return;
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.SECRET_KEY!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login berhasil",
      data: {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        role: user.role,
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

  const image_profil = req.file?.filename;

  console.log("====================================");
  console.log(image_profil);
  console.log("====================================");

  const t = await db.transaction();

  try {
    const existing = await User.findOne({ where: { email }, transaction: t });
    if (existing) {
      await t.rollback();
      res.status(400).json({ message: "Email sudah terdaftar." });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        nama,
        email,
        password: hash,
        role,
      },
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
  const image_profil = req.file?.filename;

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

      if (image_profil) {
        // Hapus file lama jika ada
        if (karyawan.image_profil) {
          const oldPath = path.join(
            __dirname,
            "../../uploads/profil",
            karyawan.image_profil
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Simpan file baru
        karyawan.image_profil = image_profil;
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

export default {
  login,
  register,
  editUser,
  getUserDetail,
};

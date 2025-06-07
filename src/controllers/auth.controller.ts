import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@configs/database";
import Karyawan from "@models/karyawan.model";
import { NextFunction, Request, Response } from "express";
import User, { IUserAttributes } from "@models/user.model";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    nama,
    email,
    password,
    role,
    nip,
    jabatan,
    alamat_lengkap,
    image_profil,
  } = req.body;

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
      },
      { transaction: t }
    );

    await t.commit();

    res
      .status(201)
      .json({ message: "User dan karyawan berhasil dibuat", user: newUser });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

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

export default { register, login };

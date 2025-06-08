import {
  DataTypes,
  Model,
  Optional,
  ForeignKey,
  CreationOptional,
} from "sequelize";
import db from "@configs/database";

export enum EnumKategoriPresensi {
  MASUK_KERJA = "MASUK_KERJA",
  IZIN_KERJA = "IZIN_KERJA",
  CUTI_KERJA = "CUTI_KERJA",
  DINAS_KERJA = "DINAS_KERJA",
}

// Interface field Absensi
export interface IPresensiAttributes {
  id_absensi: number;
  id_karyawan: number;
  tanggal: Date;
  jam_masuk?: string;
  jam_pulang?: string;
  lokasi_masuk?: string;
  lokasi_pulang?: string;
  foto_masuk?: string;
  foto_pulang?: string;
  total_jam_lembur?: string;
  kategori?: EnumKategoriPresensi;
}

// Field yang optional saat create
interface IAbsensiCreationAttributes
  extends Optional<IPresensiAttributes, "id_absensi"> {}

class Presensi
  extends Model<IPresensiAttributes, IAbsensiCreationAttributes>
  implements IPresensiAttributes
{
  declare id_absensi: CreationOptional<number>;
  declare id_karyawan: ForeignKey<number>;
  declare tanggal: Date;
  declare jam_masuk: string;
  declare jam_pulang: string;
  declare lokasi_masuk: string;
  declare lokasi_pulang: string;
  declare foto_masuk: string;
  declare foto_pulang: string;
  declare total_jam_lembur: string;
  declare kategori: EnumKategoriPresensi;
  declare presensis?: Presensi[];
}

Presensi.init(
  {
    id_absensi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_karyawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jam_masuk: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jam_pulang: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    lokasi_masuk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lokasi_pulang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foto_masuk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foto_pulang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_jam_lembur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "t_absensi",
    timestamps: false,
  }
);

export default Presensi;

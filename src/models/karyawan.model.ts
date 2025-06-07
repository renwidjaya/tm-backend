import {
  DataTypes,
  Model,
  Optional,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import db from "@configs/database";
import User from "./user.model";
import Presensi from "./presensi.model";

// Interface untuk atribut model
export interface IKaryawanAttributes {
  id_karyawan: number;
  id_user: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  image_profil?: string;
  created_at: Date;
  updated_at: Date;
}

// Optional untuk saat create
interface IKaryawanCreationAttributes
  extends Optional<
    IKaryawanAttributes,
    "id_karyawan" | "created_at" | "updated_at"
  > {}

class Karyawan
  extends Model<IKaryawanAttributes, IKaryawanCreationAttributes>
  implements IKaryawanAttributes
{
  declare id_karyawan: CreationOptional<number>;
  declare id_user: ForeignKey<number>;
  declare nama_lengkap: string;
  declare nip: string;
  declare jabatan: string;
  declare alamat_lengkap: string;
  declare image_profil: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Karyawan.init(
  {
    id_karyawan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat_lengkap: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_profil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: "m_karyawan",
    timestamps: false,
  }
);

export default Karyawan;

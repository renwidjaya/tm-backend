import { DataTypes, Model, Optional } from "sequelize";
import db from "@configs/database";

export enum EnumRole {
  Admin = "ADMIN",
  Karyawan = "KARYAWAN",
}

export interface IUserAttributes {
  id_user: number;
  nama: string;
  email: string;
  password: string;
  role: EnumRole;
}

interface UserCreationAttributes extends Optional<IUserAttributes, "id_user"> {}

class User
  extends Model<IUserAttributes, UserCreationAttributes>
  implements IUserAttributes
{
  public id_user!: number;
  public nama!: string;
  public email!: string;
  public password!: string;
  public role!: EnumRole;
}

User.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "m_users",
    modelName: "User",
    timestamps: false,
  }
);

export default User;

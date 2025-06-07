import User from "./user.model";
import Karyawan from "./karyawan.model";
import Presensi from "./presensi.model";

// Relasi User <-> Karyawan
User.hasOne(Karyawan, { foreignKey: "id_user", as: "karyawan" });
Karyawan.belongsTo(User, { foreignKey: "id_user", as: "user" });

// Relasi Karyawan <-> Presensi
Karyawan.hasMany(Presensi, { foreignKey: "id_karyawan", as: "presensis" });
Presensi.belongsTo(Karyawan, { foreignKey: "id_karyawan", as: "karyawan" });

export { User, Karyawan, Presensi };

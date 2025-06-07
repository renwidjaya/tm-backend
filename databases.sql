CREATE TABLE user (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pegawai') DEFAULT 'pegawai'
);


CREATE TABLE karyawan (
  id_karyawan INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  nip VARCHAR(50),
  jabatan VARCHAR(100),
  alamat_lengkap TEXT,
  image_profil VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES user(id_user)
);


CREATE TABLE absensi (
  id_absensi INT AUTO_INCREMENT PRIMARY KEY,
  id_karyawan INT NOT NULL,
  tanggal DATE NOT NULL,
  jam_masuk TIME,
  jam_pulang TIME,
  lokasi_masuk VARCHAR(255),
  lokasi_pulang VARCHAR(255),
  foto_masuk VARCHAR(255),
  foto_pulang VARCHAR(255),
  total_jam_lembur VARCHAR(20),
  kategori ENUM('masuk', 'lembur', 'izin', 'sakit') DEFAULT 'masuk',
  FOREIGN KEY (id_karyawan) REFERENCES karyawan(id_karyawan)
);
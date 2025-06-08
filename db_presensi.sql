-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: db_presensi
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `m_karyawan`
--

DROP TABLE IF EXISTS `m_karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_karyawan` (
  `id_karyawan` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `alamat_lengkap` text,
  `image_profil` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_karyawan`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `m_karyawan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `m_users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_karyawan`
--

LOCK TABLES `m_karyawan` WRITE;
/*!40000 ALTER TABLE `m_karyawan` DISABLE KEYS */;
INSERT INTO `m_karyawan` VALUES (1,2,'Rendi Widjaya','199201012021011001','Fullstack Developer','Jl. AL Falah 2 No. 10 E, Jakarta','profil-1749358251096.jpeg','2025-06-07 10:56:22','2025-06-08 11:51:18'),(2,3,'Indrawan S.Kom','199201012021011002','Fullstack Developer','Jl. AL Falah 2 No. 10 E, Jakarta','profil-1749358251096.jpeg','2025-06-08 04:50:51','2025-06-08 11:51:56'),(3,4,'Suparman S.Kom','199201012021011003','Fullstack Developer','Jl. AL Falah 2 No. 10 E, Jakarta','profil-1749358303114.jpeg','2025-06-08 04:51:43','2025-06-08 04:51:43');
/*!40000 ALTER TABLE `m_karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_users`
--

DROP TABLE IF EXISTS `m_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','KARYAWAN') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_users`
--

LOCK TABLES `m_users` WRITE;
/*!40000 ALTER TABLE `m_users` DISABLE KEYS */;
INSERT INTO `m_users` VALUES (2,'Rendi Widjaya','renwidjaya@gmail.com','$2b$10$N.RDmy9p.BUKAXzUdBNNaO8se.VjQlakZ/7SqnBegmdkhCjPhrjp6','ADMIN'),(3,'Indrawan S.Kom','indrawan@gmail.com','$2b$10$R5o8RSWwBzhl9AF6r6npHe2N9h8CnBGUxK7kpu.SjCJHX79TpTG7e','KARYAWAN'),(4,'Suparman S.Kom','suparman@gmail.com','$2b$10$WFd0ldtiH7.p08vKkpWFsOGTQ8b9eNTth9Y25zgw3Grr1OIHS1dcW','KARYAWAN');
/*!40000 ALTER TABLE `m_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_absensi`
--

DROP TABLE IF EXISTS `t_absensi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_absensi` (
  `id_absensi` int NOT NULL AUTO_INCREMENT,
  `id_karyawan` int NOT NULL,
  `tanggal` date NOT NULL,
  `jam_masuk` time DEFAULT NULL,
  `jam_pulang` time DEFAULT NULL,
  `lokasi_masuk` varchar(255) DEFAULT NULL,
  `lokasi_pulang` varchar(255) DEFAULT NULL,
  `foto_masuk` varchar(255) DEFAULT NULL,
  `foto_pulang` varchar(255) DEFAULT NULL,
  `total_jam_lembur` varchar(20) DEFAULT NULL,
  `kategori` enum('MASUK_KERJA','IZIN_KERJA','CUTI_KERJA','DINAS_KERJA') NOT NULL,
  PRIMARY KEY (`id_absensi`),
  KEY `id_karyawan` (`id_karyawan`),
  CONSTRAINT `t_absensi_ibfk_1` FOREIGN KEY (`id_karyawan`) REFERENCES `m_karyawan` (`id_karyawan`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_absensi`
--

LOCK TABLES `t_absensi` WRITE;
/*!40000 ALTER TABLE `t_absensi` DISABLE KEYS */;
INSERT INTO `t_absensi` VALUES (4,1,'2025-06-07','08:00:00','19:00:00','Kantor Utama','Jl Cabe Raya','foto-masuk.jpg','foto-pulang.jpg','1.5','MASUK_KERJA'),(5,1,'2025-06-08','08:00:00','17:00:00','Kantor Utama','Jl Cabe Raya','foto-masuk.jpg','foto-pulang.jpg','1.5','MASUK_KERJA'),(8,1,'2025-06-09','08:00:00','18:00:00','Jl Cabe Raya','Jl Cabe Raya','presensi-1749360351822.jpeg','presensi-1749360393800.jpeg','2','MASUK_KERJA');
/*!40000 ALTER TABLE `t_absensi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_presensi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08 12:44:26

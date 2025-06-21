import express from "express";
import { uploadPresensi } from "@utils/upload";
import controller from "@controllers/presensi.controller";

const router = express.Router();

router.get("/karyawan", controller.getAllKaryawan);

router.post("/lists", controller.getAllPresensi);

router.get("/karyawan/:id", controller.getDetailPresensi);

router.post(
  "/checkin",
  uploadPresensi.single("foto_masuk"),
  controller.createPresensi
);

router.put(
  "/checkin/:id_presensi",
  uploadPresensi.single("foto_pulang"),
  controller.updatePresensi
);

router.post("/detail", controller.getPresensiDetail);

router.delete("/karyawan/:id", controller.deletePresensi);

router.post("/statistik", controller.getPresensiStatistik);

router.get("/export", controller.downloadPresensiExcel);

router.get("/report/all", controller.getMonthlyReportAll);

router.get("/profil/:filename", controller.getProfilPhoto);

router.get("/presensi/:filename", controller.getPresensiPhoto);

router.get("/dashboard", controller.getDashboardStatistik);

export default router;

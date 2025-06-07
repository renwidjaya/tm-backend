import express from "express";
import controller from "@controllers/presensi.controller";

const router = express.Router();

router.get("/karyawan", controller.getAllKaryawan);
router.post("/lists", controller.getAllPresensi);
router.get("/karyawan/:id", controller.getDetailPresensi);
router.post("/karyawan", controller.createPresensi);
router.put("/karyawan/:id", controller.updatePresensi);
router.delete("/karyawan/:id", controller.deletePresensi);
router.post("/statistik", controller.getPresensiStatistik);
router.get("/export", controller.downloadPresensiExcel);

export default router;

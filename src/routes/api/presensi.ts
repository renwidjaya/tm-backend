import express from "express";
import controller from "@controllers/presensi.controller";

const router = express.Router();

router.get("/karyawan", controller.getAllKaryawan);
router.get("/lists", controller.getAllPresensi);
router.get("/karyawan/:id", controller.getDetailPresensi);
router.post("/karyawan", controller.createPresensi);
router.put("/karyawan/:id", controller.updatePresensi);
router.delete("/karyawan/:id", controller.deletePresensi);

export default router;

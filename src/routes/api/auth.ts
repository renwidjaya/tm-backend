import express from "express";
import { uploadProfil } from "@utils/upload";
import controller from "@controllers/auth.controller";

const router = express.Router();

router.post(
  "/register",
  uploadProfil.single("image_profil"),
  controller.register
);

router.post("/login", controller.login);

export default router;

import express from "express";
import { uploadProfil } from "@utils/upload";
import controller from "@controllers/auth.controller";

const router = express.Router();

router.post("/login", controller.login);

router.post(
  "/register",
  uploadProfil.single("image_profil"),
  controller.register
);

router.get("/user/:id_user", controller.getUserDetail);

router.post(
  "/user/:id_user",
  uploadProfil.single("image_profil"),
  controller.editUser
);


export default router;

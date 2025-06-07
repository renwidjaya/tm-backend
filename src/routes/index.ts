import express from "express";
import authRoutes from "@routes/api/auth";
import absensiRoutes from "@routes/api/presensi";
import { authorize } from "@middlewares/auth.middleware";

const routes = express.Router();

routes.use("/v1-auth", authRoutes);
routes.use("/v1-presensi", authorize, absensiRoutes);

export default routes;

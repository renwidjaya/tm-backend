import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Application } from "express";

import apiRoutes from "@routes/index";
import { corsOptions, db } from "@configs/index";
import { notFound } from "@middlewares/error-notfound";
import { responseTime } from "@middlewares/response-time";
import { errorhandler } from "@middlewares/error-handler";

const app: Application = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(responseTime);

app.get("/health", async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({ status: "up", database: "connected" });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: err.message,
    });
  }
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorhandler);

// Jalankan server setelah koneksi DB berhasil
db.authenticate()
  .then(() => {
    const PORT = process.env.PORT_SERVER || 8000;
    app.listen(PORT, () => {
      console.log(`🔥 SERVER EXPENDITURE ON PORT : ${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Error connecting to DB:", error));

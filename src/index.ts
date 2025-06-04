import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Halo dari TM Technology Backend 🎉");
});

app.get("/check", (_req, res) => {
  res.send("server up 🎉");
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

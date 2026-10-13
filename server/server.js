import "dotenv/config"; // memuat .env sebelum modul lain dievaluasi
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { checkEnv } from "./src/config/env.js";

checkEnv();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
});
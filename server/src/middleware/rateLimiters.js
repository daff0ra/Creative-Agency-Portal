import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // jendela waktu 15 menit
  limit: 10, // maksimal 10 percobaan per IP dalam satu jendela
  skipSuccessfulRequests: true, // hanya login yang GAGAL yang dihitung, jadi pengguna sah tidak terkena
  standardHeaders: true, // kirim header RateLimit-* supaya client tahu sisa jatahnya
  legacyHeaders: false,
  message: { message: "Terlalu banyak percobaan login, coba lagi dalam 15 menit" },
});
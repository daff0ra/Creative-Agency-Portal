export const refreshCookieOptions = {
    httpOnly: true, // tidak terbaca JavaScript di browser
    secure: process.env.NODE_ENV === "production", // di produksi hanya dikirim lewat HTTPS
    sameSite: "strict", // tidak ikut terkirim dari situs lain
    path: "/auth", // hanya terkirim ke endpoint /auth/*, tidak ke setiap request
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
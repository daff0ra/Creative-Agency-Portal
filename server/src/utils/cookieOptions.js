export const refreshCookieOptions = {
    httpOnly: true, // tidak terbaca JavaScript di browser
    secure: process.env.NODE_ENV === "production", // di produksi hanya dikirim lewat HTTPS
    // Frontend dan API production berada di origin berbeda; SameSite=None
    // diperlukan agar browser mengirim refresh cookie pada request credentialed.
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/auth", // hanya terkirim ke endpoint /auth/*, tidak ke setiap request
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

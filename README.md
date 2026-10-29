# Creative Agency Portal

Portal kerja bersama agency dan client. Aplikasi terdiri dari React/Vite di `client` dan Express/MongoDB di `server`.

## Menjalankan aplikasi secara lokal

### 1. Siapkan MongoDB

Backend lokal memakai MongoDB di `mongodb://127.0.0.1:27017/creative-agency-portal`. Pastikan service MongoDB lokal berjalan. Endpoint health API adalah `http://localhost:5000/health`; respons `200` dengan `{"status":"ok"}` berarti API dan database sudah terhubung.

Jika memilih MongoDB Atlas, pastikan IP publik komputer yang menjalankan backend masuk ke **Network Access** pada Atlas, database user aktif, dan `MONGO_URI` memakai kredensial/cluster yang benar. Error `Could not connect to any servers in your MongoDB Atlas cluster` biasanya berarti koneksi ditolak atau tidak dapat mencapai cluster; CRUD tidak akan bekerja sebelum koneksi database berhasil.

### 2. Jalankan backend

Di terminal pertama:

```powershell
cd server
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run dev
```

Edit `server/.env` dan isi dua JWT secret dengan string acak minimal 32 karakter. `.env.example` menggunakan MongoDB lokal. Untuk mengarahkan backend lokal ke Atlas, ganti `MONGO_URI` dengan connection string Atlas dan atur allowlist IP seperti di atas.

Konfigurasi lokal opsional `server/.env.local` akan meng-override `.env` dan tidak dilacak Git. Untuk memakai MongoDB lokal tanpa mengubah `.env` Atlas, buat `server/.env.local` berisi:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/creative-agency-portal
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Jalankan frontend

Di terminal kedua:

```powershell
cd client
npm install
npm run dev
```

Buka `http://localhost:5173`. Saat Vite berjalan dalam mode development, API default adalah `http://localhost:5000`. `client/.env.local` juga menetapkan alamat lokal secara eksplisit; restart Vite setelah mengubah file tersebut.

### Catatan request HTTP dan Not Found

- Frontend lokal harus mengirim request ke API lokal, bukan API produksi. Periksa `Request URL` di DevTools → Network; endpoint lokal harus diawali `http://localhost:5000/`.
- `404 Endpoint tidak ditemukan` menunjukkan path/method tidak terdaftar pada server yang menerima request. Pastikan backend lokal berjalan pada port 5000 dan Vite sudah direstart setelah perubahan konfigurasi.
- Jika `/health` mengembalikan `503`, backend belum terhubung ke MongoDB. Selesaikan koneksi DB terlebih dahulu; endpoint CRUD membutuhkan koneksi tersebut.
- `client/.env.local` dan `server/.env.local` bersifat lokal dan tidak masuk Git. Jangan menaruh secret produksi ke file yang dilacak.

## Deployment

Build frontend memakai `VITE_API_URL` dari environment build. Jika tidak diatur dalam production build, API produksi adalah `https://creative-agency-portal.onrender.com`. Backend production harus mengatur `MONGO_URI`, JWT secrets, dan `CLIENT_ORIGINS` dengan origin frontend yang tepat.

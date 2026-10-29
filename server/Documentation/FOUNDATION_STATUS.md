# Status Fondasi Kode Saat Ini

**Tanggal snapshot:** 29 Oktober 2026  
**Branch sumber:** `staging`  
**Commit dasar:** `58f8195` (`feat : konfiguration vercel`)  
**Status produk:** Fondasi MVP / baseline pengembangan  
**Tujuan dokumen:** Menjelaskan kode yang ada sebagai karya fondasi awal agar tim dapat mengembangkan dan merefaktor secara bertahap tanpa kehilangan konteks.

## Ringkasan

Aplikasi ini adalah portal agency-client berbasis MERN: frontend React/Vite, API Express, dan MongoDB/Mongoose. Fondasi saat ini sudah mencakup autentikasi, role, organisasi/client, project dan tim project, onboarding checklist, dashboard, serta konfigurasi deployment. Portal belum menjadi sistem pengelolaan pekerjaan penuh karena task project, review deliverable, komentar/aktivitas, dan notifikasi belum tersedia.

## Struktur dan tanggung jawab

### Frontend (`client/src`)

- `App.jsx`: deklarasi route dan route terproteksi.
- `context/AuthContext.jsx`: konteks sesi pengguna.
- `api/axios.js`: klien HTTP untuk API.
- `pages/`: login, dashboard agency/client, organisasi, detail organisasi, tambah staff.
- `components/layout/`: layout dashboard dan navigasi.
- `components/ui/`: komponen presentasi reusable.
- `hooks/useOrganizationData.js`: pengambilan data organisasi, project, onboarding.
- `constants/`: label status dan role.

### Backend (`server/src`)

- `app.js`: middleware umum dan mounting route.
- `routes/`: endpoint auth, organizations, projects, onboardingTask, dashboard, users.
- `controllers/`: alur request bisnis.
- `models/`: User, Organization, Project, OnboardingTask.
- `middleware/`: autentikasi JWT, otorisasi role, validasi, error handler, rate limit.
- `validators/schemas.js`: validasi request memakai Zod.
- `utils/`: aturan team, token, cookie, async handler.
- `config/`: environment dan koneksi database.

## Entitas dan relasi saat ini

- **User**: agency/client, role, status aktif, organisasi untuk akun client, hash password dan refresh token.
- **Organization**: profil client, account manager, status onboarding; owner dihitung melalui virtual relasi User.
- **Project**: milik satu Organization, mempunyai banyak anggota tim agency, pembuat, status, tanggal mulai dan tenggat.
- **OnboardingTask**: checklist milik Organization dengan urutan dan status selesai.

Relasi konseptual: satu Organization memiliki banyak Project dan OnboardingTask; Project mempunyai banyak anggota User; Organization memiliki Client Owner dan Account Manager.

## Alur yang telah tersedia

1. Pengguna login; API memverifikasi kredensial dan mengeluarkan token.
2. Agency mengelola organisasi dan menetapkan account manager.
3. Project dibuat untuk organisasi dan dapat diberi tim agency.
4. Client melihat profil, tahapan onboarding, project, dan account manager.
5. Client menandai tahapan onboarding selesai; status onboarding dihitung dari task tersisa.
6. Dashboard agency menampilkan ringkasan onboarding, project, dan task pending.

## Akses dan batas tenant

- Route memakai JWT authentication dan role authorization.
- Beberapa controller memeriksa apakah client hanya mengakses organisasinya.
- Semua fitur baru yang memuat data client wajib membatasi query berdasarkan organisasi project, memvalidasi role dan keanggotaan di server, serta menghindari kepercayaan pada ID dari request.
- Pemeriksaan ini merupakan catatan implementasi; belum berarti audit keamanan menyeluruh telah dilakukan.

## Batas kemampuan saat ini

Belum ada entitas/fitur task project, prioritas, estimasi, dependensi, komentar, aktivitas audit terstruktur, file storage, deliverable versi, review client, notifikasi, kalender, pencarian, atau laporan kapasitas. Status project tidak dapat menggantikan status task dan keputusan review.

## Catatan pemeriksaan untuk ditinjau

Ini adalah temuan awal dari pembacaan source code, bukan perubahan kode atau hasil pengujian:

1. `server/src/controllers/project.js`: `assignTeam` menerima `userIds`, tetapi validasi saat ini memanggil `allActiveAgencyStaff(team)`; tinjau sebagai potensi reference error. Fungsi pembuat project memakai validasi anggota tim.
2. `server/src/controllers/dashboard.js`: respons berisi `organization`, sedangkan dashboard frontend membaca `organizations`; selain itu pending task tidak membatasi organisasi/user. Selaraskan kontrak dan definisi akses.
3. `server/src/app.js`: `errorHandler` dipasang sebelum route; middleware error Express umumnya ditempatkan setelah seluruh route agar menangkap error dari route.
4. Otorisasi perlu ditinjau pada setiap operasi berbasis ID, termasuk akses client terhadap project/onboarding serta pembatasan staff agency ke project yang relevan.
5. Pembuatan organisasi membuat beberapa dokumen bertahap dan melakukan cleanup manual. Untuk konsistensi yang lebih kuat, pertimbangkan transaksi MongoDB jika deployment mendukung replica set; dokumentasikan fallback.
6. Penyelesaian onboarding memperbarui status organisasi berdasarkan jumlah task belum selesai; tinjau perilaku untuk daftar kosong dan kemungkinan task dibuka kembali.
7. Kontrak API, transisi status yang sah, dan audit trail belum didokumentasikan sebagai standar bersama.

Perbaiki/validasi temuan sebagai backlog; jangan menganggap catatan sebagai bug terkonfirmasi sebelum direproduksi.

## Panduan refaktor aman

- Pertahankan perilaku yang sudah dipakai dan dokumentasikan perubahan kontrak API.
- Refaktor satu alur vertikal tiap perubahan; hindari migrasi model besar bercampur dengan perubahan UI.
- Pisahkan validasi request, authorization, aturan bisnis, dan akses database secara konsisten.
- Tetapkan aturan transisi status di server, bukan hanya tombol frontend.
- Tambahkan migrasi/kompatibilitas bila field atau enum berubah.
- Untuk setiap story, tautkan requirement, acceptance criteria, PR, dan catatan rilis.
- Perubahan ke environment, deployment, atau data produksi harus memiliki prosedur rilis/rollback yang jelas.

## Status progres baseline

| Area | Status saat ini | Tahap berikut |
|---|---|---|
| Login dan role | Fondasi tersedia | Audit izin dan siklus refresh token |
| Client/organisasi | Fondasi tersedia | Validasi alur dan audit tenant |
| Project/tim | Fondasi tersedia, kemampuan terbatas | Stabilkan assignment; tambah brief dan task |
| Onboarding | Checklist tersedia | Tetapkan aturan reopen/empty dan histori |
| Dashboard | Ringkasan tersedia | Selaraskan kontrak API, tambah metrik task |
| Acceptance/review | Belum tersedia | Deliverable berversi dan keputusan client |
| Aktivitas/notifikasi | Belum tersedia | Activity log dan notifikasi |
| Deployment | Konfigurasi frontend/API tersedia di repo | Catat runbook release/rollback |

Rencana prioritas dan kolom tracking backlog berada di `PRODUCT_ROADMAP.md`.

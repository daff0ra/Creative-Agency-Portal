# Roadmap Pengembangan Creative Agency Portal

Dokumen kerja untuk menyepakati arah produk, menyusun kebutuhan yang dapat diuji, dan melacak progres. Status awal backlog adalah **Backlog**; isi pemilik, target, dan tautan issue/PR saat item dimulai.

## Tujuan dan pengguna

Portal menjadi ruang kerja bersama agency dan client untuk mengelola relasi client, project, tugas, hasil kerja, persetujuan, dan tenggat.

- **Admin agency**: client, anggota, akses, konfigurasi.
- **Account manager**: onboarding, komunikasi, alur persetujuan.
- **Staff agency**: mengerjakan item yang ditugaskan.
- **Client owner**: memantau progres, memberi masukan, menerima/meminta revisi hasil yang dibagikan.

## Kondisi saat ini

Berdasarkan source code yang diperiksa pada 29 Oktober 2026:

- Sudah ada autentikasi, role agency/client, organisasi, account manager, project, assignment tim, status project, dashboard, dan onboarding checklist.
- Project belum memiliki task/subtask, prioritas, estimasi, riwayat perubahan, atau komentar.
- Belum ada alur review deliverable dengan keputusan accept/request changes dan bukti persetujuan, notifikasi, atau laporan progres berbasis task.
- Indikasi bug: validasi assignment tim memakai variabel `team` padahal inputnya `userIds`; ringkasan dashboard mengirim `organization` sedangkan UI membaca `organizations`. Perlu diselaraskan.

Temuan ini dari source code, bukan audit konfigurasi deployment atau kondisi produksi.

## Arah dan prinsip

1. Jadikan status, pemilik, tenggat, acceptance criteria, dan keputusan review sumber kebenaran tunggal.
2. Client melihat progres dan deliverable yang dibagikan; catatan internal agency tetap privat.
3. Tulis hasil dan syarat penerimaan yang dapat diamati.
4. Catat pelaku, waktu, dan konteks untuk perubahan scope, persetujuan, dan revisi.
5. Buat model inti generik untuk desain, web, branding, konten, dan kampanye; gunakan template untuk langkah layanan yang spesifik.

| Tahap | Fokus | Hasil | Prioritas |
|---|---|---|---|
| 0 | Stabilkan fondasi | Bug API/UI, konsistensi status, dan akses diperbaiki | P0 |
| 1 | Definisikan pekerjaan | Brief, user story, acceptance criteria, task/subtask | P0 |
| 2 | Jalankan pekerjaan | Board/list, assignee, prioritas, tenggat, komentar, aktivitas | P0 |
| 3 | Review dan serah-terima | Deliverable berversi, accept/request changes | P1 |
| 4 | Koordinasi | Notifikasi, pencarian/filter, kalender, file/link, ringkasan | P1 |
| 5 | Operasional skala | Template layanan, kapasitas, laporan, audit akses, integrasi | P2 |

## Backlog tracking

Alur status: **Backlog → Ready → In Progress → Review → Done**.

| ID | Prioritas | Item | Kriteria selesai | Status | Pemilik | Target | Issue/PR |
|---|---|---|---|---|---|---|---|
| FND-01 | P0 | Samakan field organisasi dashboard | Angka dan status tepat, termasuk data kosong | Backlog | — | — | — |
| FND-02 | P0 | Perbaiki validasi assignment tim | Hanya staff agency aktif ditugaskan; input invalid ditolak | Backlog | — | — | — |
| FND-03 | P0 | Audit otorisasi tenant | API menolak akses lintas organisasi/role | Backlog | — | — | — |
| WRK-01 | P0 | Project brief dan scope | Tujuan, scope/out-of-scope, deliverable, stakeholder, tanggal tersedia | Backlog | — | — | — |
| WRK-02 | P0 | User story dan acceptance criteria | Story punya aktor, manfaat, AC terukur, status persetujuan | Backlog | — | — | — |
| WRK-03 | P0 | Task/subtask project | Status, prioritas, assignee, tenggat, AC, akses tervalidasi server | Backlog | — | — | — |
| WRK-04 | P0 | Board dan daftar task | Filter status/assignee/prioritas/tenggat; perubahan tersimpan | Backlog | — | — | — |
| WRK-05 | P1 | Komentar dan aktivitas | Pelaku/waktu terlihat; catatan internal tersembunyi dari client | Backlog | — | — | — |
| REV-01 | P1 | Deliverable dan review client | Versi dibagikan; client accept/request changes dengan komentar tercatat | Backlog | — | — | — |
| REV-02 | P1 | Revisi dan persetujuan scope | Revisi terkait versi; perubahan scope disetujui pihak berwenang | Backlog | — | — | — |
| COM-01 | P1 | Notifikasi | Event penting memberi notifikasi dan tautan item | Backlog | — | — | — |
| COM-02 | P1 | File dan tautan | Metadata uploader/waktu/akses/relasi tercatat | Backlog | — | — | — |
| OPS-01 | P2 | Template layanan | Dapat digunakan ulang tanpa mengubah histori project lama | Backlog | — | — | — |
| OPS-02 | P2 | Laporan kapasitas/keterlambatan | Filter per client/project/periode; estimasi dibedakan dari aktual | Backlog | — | — | — |

## Requirement, user story, dan acceptance criteria

Requirement menjelaskan kebutuhan/aturan. **Acceptance criteria (AC)** menentukan kondisi story diterima dan harus dapat diverifikasi. Gunakan Given/When/Then untuk kondisi dan hak akses.

Template requirement:

- ID/judul, masalah/peluang, aktor/hak akses, kebutuhan, aturan bisnis, out-of-scope, dependensi/risiko.

Template story:

> Sebagai **[peran]**, saya ingin **[kemampuan]**, agar **[hasil/manfaat]**.

- Konteks:
- AC: Given [kondisi], when [aksi], then [hasil teramati].
- Data/akses:
- Kasus gagal/validasi:
- Desain/referensi:

### Contoh: client menerima deliverable

**Sebagai client owner, saya ingin menerima deliverable yang sudah ditinjau agar agency mengetahui hasilnya diterima.**

1. Given deliverable berstatus `in_review` milik organisasi saya, when saya memilih **Terima**, then status `accepted`, versi, pengguna, dan waktu tersimpan.
2. Jika status bukan `in_review`, API menolak perubahan dan status tetap.
3. Jika saya bukan client owner organisasi project, API mengembalikan 403 tanpa menyimpan keputusan.
4. Anggota project dapat melihat aktor, waktu, versi, dan komentar keputusan di aktivitas.
5. **Minta revisi** mengharuskan komentar, mengubah status ke `changes_requested`, dan mengaitkan komentar ke versi yang ditinjau.

### Menjadikan story fondasi project

1. Mulai dari hasil bisnis dan indikator keberhasilan.
2. Identifikasi aktor; petakan kickoff sampai handover.
3. Pecah scope menjadi story vertikal yang memberi hasil kecil dan dapat ditinjau.
4. Sepakati AC sebelum status **Ready**, termasuk akses, validasi, dan kegagalan.
5. Urutkan berdasarkan nilai, risiko, dan dependensi.
6. Hubungkan requirement → story → task → PR → rilis → bukti verifikasi.
7. Libatkan client untuk keputusan kebutuhan/hasil yang menjadi tanggung jawabnya.

Definition of Ready: aktor/manfaat jelas; AC dapat diuji; akses/data/kasus gagal/dependensi diketahui; story cukup kecil untuk satu iterasi; desain/konten tersedia jika perlu.

## DoD / “DFO”

Istilah **DFO** belum ditemukan di kode atau README. Konfirmasikan apakah maksudnya **DoD (Definition of Done)** atau istilah lain. Sementara gunakan kerangka DoD berikut dan sesuaikan per fitur. DoD adalah standar kualitas internal; acceptance/review client adalah keputusan bahwa hasil memenuhi kebutuhan.

- [ ] Semua AC terpenuhi dan dapat ditunjukkan.
- [ ] Validasi input, otorisasi, dan kondisi error ditangani.
- [ ] UI memiliki loading/empty/success/error state bila relevan.
- [ ] API/model konsisten dan tidak membocorkan data lintas organisasi.
- [ ] Perubahan skema punya strategi kompatibilitas/migrasi.
- [ ] Review kode selesai; dokumentasi/kontrak API diperbarui jika berubah.
- [ ] Pemeriksaan kualitas yang disepakati tim berjalan; hasil dicatat di PR.
- [ ] Fitur siap diverifikasi pemilik produk pada environment target.
- [ ] Untuk fitur client-facing: tidak ada catatan internal; konteks/versi/aksi jelas; keputusan dan revisi menyimpan aktor, waktu, versi, komentar.

## Status dan data yang disarankan

- Project saat ini: `planning`, `in_progress`, `in_review`, `completed`, `on_hold`; pertimbangkan `cancelled` dengan transisi jelas.
- Task: `backlog`, `ready`, `in_progress`, `blocked`, `in_review`, `done`.
- Review deliverable: `draft`, `in_review`, `changes_requested`, `accepted`.
- Task minimum: project, title, description, status, priority, assignees, dueDate, acceptanceCriteria, createdBy/updatedBy, timestamps; opsional parentTask/blockedBy.
- Deliverable minimum: project/task, title, version, links/files, status, submittedBy/At, decisionBy/At, decisionComment, histori versi.
- Semua query dibatasi organisasi dari project; perubahan penting menyimpan pelaku dan waktu. Task selesai tidak otomatis berarti project selesai jika deliverable belum diterima.

## Keputusan dan ritme tracking

| Topik | Rekomendasi | Status |
|---|---|---|
| Arti DFO | Konfirmasi DoD atau istilah lain | Perlu konfirmasi |
| File upload | Awali metadata/tautan; pilih object storage sebelum upload produksi | Belum diputuskan |
| Notifikasi | Mulai in-app, kemudian email | Belum diputuskan |
| Persetujuan | Terikat versi deliverable dengan jejak audit | Rekomendasi |
| Perubahan scope | Catat persetujuan sebelum estimasi/tenggat berubah | Rekomendasi |
| Otorisasi | Server validasi role, anggota project, organisasi | Wajib |

Review backlog mingguan, tetapkan pemilik/target saat item masuk **Ready**, tautkan issue dan PR, centang AC saat review, dan catat rilis/tanggal ketika **Done**.

| Tanggal review | Keputusan/perubahan prioritas | ID terkait | Pemilik keputusan |
|---|---|---|---|
| — | — | — | — |

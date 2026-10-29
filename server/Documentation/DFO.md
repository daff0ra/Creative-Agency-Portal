# DFO — Dokumen Fondasi dan Outcome Pengembangan

## Tujuan

DFO ini menjadi kesepakatan kerja untuk menjaga arah pengembangan portal, memperjelas kondisi fondasi saat ini, dan membuat refaktor dapat dilakukan bertahap. DFO bukan spesifikasi final; perubahan keputusan dicatat pada bagian log.

## Fondasi yang dipertahankan

Kode saat ini merupakan fondasi MVP yang telah dibuat oleh pemilik proyek. Pengembangan berikutnya sebaiknya memperkuat fondasi tersebut: React/Vite untuk UI, Express API, MongoDB/Mongoose, pemisahan client dan agency, role, organisasi sebagai batas data client, serta model project yang menghubungkan client dengan tim agency.

Status rinci modul dan temuan awal ada di `FOUNDATION_STATUS.md`. Roadmap dan backlog prioritas ada di `PRODUCT_ROADMAP.md`.

## Outcome yang dituju

1. Agency dapat mengelola beberapa organisasi dan project dengan batas akses yang benar.
2. Setiap project dapat dipecah menjadi task yang memiliki pemilik, status, prioritas, tenggat, dan acceptance criteria.
3. Client dapat memantau progres yang dibagikan dan memberi keputusan pada deliverable tertentu.
4. Perubahan status, komentar, revisi, dan persetujuan memiliki konteks, pelaku, waktu, serta jejak yang bisa ditelusuri.
5. Jenis layanan agency berbeda dapat memakai alur inti yang sama dengan template tahap kerja yang dapat dikonfigurasi.
6. Perubahan kode dapat dirilis bertahap tanpa kehilangan kompatibilitas data dan perilaku yang telah digunakan.

## Prinsip desain dan pengembangan

- **Tenant isolation**: Organization adalah batas data client; API selalu memvalidasi akses pada server.
- **Role + resource authorization**: role menentukan kemampuan umum, kepemilikan/keanggotaan resource menentukan akses spesifik.
- **Generic core, configurable workflow**: inti task/deliverable tidak menyimpan asumsi khusus layanan; template memberi nama tahap dan checklist khusus.
- **Explicit transitions**: status berubah melalui transisi sah; keputusan review tidak disamakan dengan status project.
- **Traceability**: requirement, story, task, perubahan kode, rilis, dan keputusan pengguna saling tertaut.
- **Incremental refactoring**: perbaiki satu alur pada satu waktu, dengan kontrak API dan dampak data terdokumentasi.

## Definition of Ready untuk pekerjaan

Pekerjaan siap dikerjakan bila:

- Tujuan dan aktor jelas.
- User story menjelaskan kebutuhan serta manfaat.
- Acceptance criteria dapat diverifikasi, mencakup akses dan kondisi gagal.
- Dampak pada API, model data, UI, dan data lama sudah diketahui.
- Dependensi, risiko, dan batasan scope tercatat.
- Pemilik produk dan pelaksana sepakat terhadap hasil yang diterima.

## Definition of Done umum

Pekerjaan selesai bila:

- Semua acceptance criteria terpenuhi dan ada bukti verifikasi.
- Input, izin akses, data tenant, dan error ditangani.
- Perubahan model memiliki strategi kompatibilitas/migrasi.
- UI menyediakan state yang relevan; API dan UI menggunakan kontrak konsisten.
- Perubahan penting tercatat pada histori/aktivitas yang sesuai.
- Review kode dan dokumentasi kontrak yang terdampak selesai.
- Catatan rilis menyebut perubahan perilaku dan langkah operasional yang diperlukan.
- Pemilik produk dapat memverifikasi hasil pada environment yang dituju.

Untuk keputusan deliverable, Definition of Done tim tidak menggantikan acceptance client. Acceptance client harus terkait deliverable/version dan disimpan sebagai keputusan terpisah.

## Alur requirement ke rilis

`Outcome → Requirement → User story + acceptance criteria → Task → PR → Verifikasi → Rilis → Feedback`

Setiap perubahan scope setelah story **Ready** dicatat beserta alasan dan dampaknya pada waktu/biaya/hasil.

## Tahap implementasi yang direkomendasikan

1. Stabilkan kontrak API, dashboard, assignment, serta pemeriksaan akses dan tenant.
2. Definisikan model dan alur task project paling kecil yang berguna.
3. Tampilkan task dalam list/board; lengkapi penanggung jawab, status, prioritas, tenggat, dan AC.
4. Tambah aktivitas/komentar dengan pembedaan catatan internal dan pesan yang dibagikan.
5. Tambah deliverable berversi dan review client: accept atau request changes.
6. Tambah notifikasi, file storage, template layanan, dan laporan setelah alur inti terbukti dipakai.

## Generalisasi workflow

Gunakan abstraksi sederhana:

- **Project** memiliki template/alur kerja dan milestone.
- **Task** merepresentasikan unit pekerjaan dengan status, owner, due date, dan acceptance criteria.
- **Deliverable** merepresentasikan hasil yang dapat direview, memiliki versi dan keputusan.
- **Workflow template** menentukan tahapan/checklist default untuk jenis jasa; data project yang sudah berjalan tidak berubah saat template diperbarui.
- **Organization** menjadi konteks client dan batas izin; account manager/team ditautkan melalui referensi.

Jangan membuat workflow engine yang terlalu fleksibel pada tahap awal. Mulai dengan status terbatas dan konfigurasi template sederhana; perluas setelah pola nyata dari beberapa project diketahui.

## Keputusan terbuka

| Pertanyaan | Keputusan awal | Status |
|---|---|---|
| Kepanjangan resmi DFO | Dokumen ini memakai DFO sebagai nama dokumen fondasi/outcome untuk kebutuhan kerja repo | Perlu disepakati |
| File | Simpan metadata dan tautan terlebih dahulu; pilih storage object sebelum menerima upload produksi | Terbuka |
| Notifikasi | In-app dahulu, email setelah event dan preferensi jelas | Terbuka |
| Workflow template | Status inti sederhana dan template checklist bertahap | Rekomendasi |
| Deployment dan rollback | Catat pemilik, environment, pemeriksaan, dan langkah rollback tiap rilis | Perlu dibuat |

## Log keputusan dan tracking

| Tanggal | Keputusan/perubahan | Alasan | Dampak | Pemilik |
|---|---|---|---|---|
| 2026-10-29 | Menetapkan kode di branch `staging` sebagai baseline dokumentasi; membuat branch backup tersendiri | Menjaga fondasi awal sebelum pengembangan lanjutan | Tidak mengubah implementasi aplikasi | — |

Gunakan status backlog `Backlog → Ready → In Progress → Review → Done`. Kaitkan item dengan ID di `PRODUCT_ROADMAP.md`, issue, PR, verifikasi, dan rilis.

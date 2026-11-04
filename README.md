# AUREUS — Aplikasi CRUD Data Siswa

Aplikasi **CRUD data siswa** untuk tugas sekolah, memakai **Next.js 15** di sisi aplikasi,
**MySQL di Aiven.io** sebagai database, dan **DBeaver** sebagai alat management database.
Tampilan memakai tema *Gelap Minimalis* — satu aksen saja, tanpa warna berlebihan, dan
tetap terbaca di layar proyektor.

| | |
|---|---|
| **Aplikasi** | Next.js 15 (App Router) + TypeScript |
| **Database** | MySQL 8 di Aiven.io (`data_siswa` di database `defaultdb`) |
| **Alat DB** | DBeaver Community Edition |
| **API** | REST (`app/api/siswa/route.ts`) |
| **Pelajar** | Achmad Syafiq Khairullah — XI RPL 5, SMK Taruna Bhakti |

---

## 1. Fitur

| Operasi | Keterangan |
|---|---|
| **Create** | Tambah data siswa lewat formulir, divalidasi di server |
| **Read** | Daftar siswa dengan pencarian, filter kelas/status, sortir, dan paginasi |
| **Update** | Ubah data siswa, termasuk dari halaman detail |
| **Delete** | Hapus data siswa dengan dialog konfirmasi |

Tambahan: dasbor berisi statistik (total siswa, sebaran per kelas, data terbaru), notifikasi
toast, tampilan responsif untuk HP, dan halaman **/panduan** berisi langkah setup Aiven & DBeaver.

## 2. Struktur Folder

```
crud-data-siswa-aiven/
├── app/
│   ├── api/
│   │   ├── siswa/route.ts          API daftar & tambah data (GET, POST)
│   │   ├── siswa/[id]/route.ts     API detail, ubah, hapus (GET, PUT, DELETE)
│   │   └── statistik/route.ts      API ringkasan untuk dasbor
│   ├── siswa/
│   │   ├── page.tsx                Halaman daftar (CRUD + filter)
│   │   ├── baru/page.tsx           Halaman tambah data
│   │   └── [id]/
│   │       ├── page.tsx            Halaman detail
│   │       └── edit/page.tsx       Halaman ubah data
│   ├── panduan/page.tsx            Panduan setup Aiven & DBeaver + ERD
│   ├── globals.css                 Seluruh desain (tema Gelap Minimalis)
│   ├── layout.tsx                  Kerangka halaman + sidebar
│   └── page.tsx                    Dasbor
├── components/                     Komponen UI (Sidebar, FormSiswa, Paginasi, dll)
├── database/
│   ├── schema-mysql.sql             Definisi tabel data_siswa (MySQL/Aiven)
│   ├── lihat-data-mysql.sql         12 query melihat data yang masuk dari aplikasi
│   ├── schema.sql                   Versi PostgreSQL (opsional)
│   ├── dbeaver-koneksi.cmd           Membuka DBeaver memakai nilai dari .env.local
│   └── dbeaver-data-sources.json     Koneksi DBeaver siap pakai (kalau mau manual)
├── docs/
│   ├── PANDUAN-AIVEN.md            Cara membuat service & user di Aiven
│   ├── PANDUAN-DBEAVER.md          Cara menghubungkan DBeaver ke Aiven
│   └── PANDUAN-API.md              Dokumentasi endpoint REST
├── lib/
│   ├── db.ts                       Koneksi database (Aiven / mode demo)
│   ├── siswa.ts                    Seluruh query SQL untuk tabel siswa
│   ├── validasi.ts                 Validasi data sebelum disimpan
│   ├── types.ts                    Tipe data bersama
│   ├── format.ts                   Utilitas format tampilan
│   └── url.ts                      Utilitas query string
├── .env.example                    Contoh konfigurasi (salin jadi .env.local)
└── package.json
```

## 3. Cara Menjalankan

### Tahap A — Terhubung dengan Aiven (perlu akun & service)

1. **Siapkan service MySQL** di [console.aiven.io](https://console.aiven.io) — kalau service-nya
   sudah ada, cukup pakai. Detailnya ada di [`docs/PANDUAN-AIVEN.md`](docs/PANDUAN-AIVEN.md).
2. **Ambil password user** Aiven (tab *Users & Databases*), lalu **isi `.env.local`**:

   ```bash
   copy .env.example .env.local
   ```

   ```
   DATABASE_URL=mysql://avnadmin:PASSWORD@mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com:18521/defaultdb?sslmode=require
   AIVEN_HOST=mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com
   AIVEN_PORT=18521
   AIVEN_DATABASE=defaultdb
   AIVEN_USER=avnadmin
   AIVEN_PASSWORD=PASSWORD
   ```

   Nilai `AIVEN_*` dipakai untuk mengisi kolom koneksi di DBeaver.
   Berkas `.env.local` **jangan pernah** di-commit ke Git.

4. **Pastikan tabelnya ada** — jalankan [`database/schema-mysql.sql`](database/schema-mysql.sql)
   di DBeaver (kalau tabel `data_siswa` sudah ada, lewati saja). Panduan lengkap:
   [`docs/PANDUAN-DBEAVER.md`](docs/PANDUAN-DBEAVER.md).
5. **Jalankan aplikasi**:

   ```bash
   npm run dev
   ```

   Buka <http://localhost:3000>. Lencana di kanan atas akan menampilkan
   *Terhubung ke PostgreSQL Aiven*.

### Tahap B — Mode demo (tanpa Aiven, untuk coba-coba)

Kalau `DATABASE_URL` tidak diisi, aplikasi otomatis memakai **mode demo**: PostgreSQL asli
(berbasis WASM) yang berjalan di dalam memori proses dengan tabel yang sudah kosong. Tidak
perlu akun apa pun untuk mencoba aplikasinya.

```bash
npm install
npm run dev
```

> Mode demo hanya untuk latihan. Saat presentasi, pastikan lencana koneksi menulis
> *Terhubung ke PostgreSQL Aiven* — itu bukti database yang benar-benar dipakai.

## 4. Struktur Data

Semua tabel disimpan di schema bernama **`sekolah`**, terpisah dari schema bawaan `public`.
Tabelnya `sekolah.data_siswa`, sudah ternormalisasi sampai bentuk pertama normal (1NF).

```
CREATE SCHEMA sekolah;

             ┌────────────────────────────────────┐
   schema    │        sekolah.data_siswa          │
  ┌──────────┼────────────────────────────────────┼───────────┐
  │  PK      │  UNIQUE     │  CHECK    │           │           │
  ▼          ▼              ▼           ▼           ▼           ▼
 id        nis           kelas      jurusan      status    created_at
 SERIAL    VARCHAR(20)   VARCHAR(10) VARCHAR(80)  VARCHAR(10) TIMESTAMPTZ
```

Kolom `status` dibatasi dengan `CHECK (status IN ('AKTIF','LULUS','PINDAH','KELUAR'))`,
dan `nis` dibatasi `UNIQUE` supaya tidak ada dua siswa dengan NIS sama.

## 5. Dokumentasi REST API

| Metode | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/siswa` | Daftar siswa (parameter: `q`, `kelas`, `status`, `sort`, `order`, `page`, `perPage`) |
| `GET` | `/api/siswa/{id}` | Detail satu siswa |
| `POST` | `/api/siswa` | Tambah siswa baru |
| `PUT` | `/api/siswa/{id}` | Ubah data siswa |
| `DELETE` | `/api/siswa/{id}` | Hapus data siswa |
| `GET` | `/api/statistik` | Ringkasan data untuk dasbor |

Contoh memakai `curl`:

```bash
# Tambah data
curl -X POST http://localhost:3000/api/siswa \
  -H "Content-Type: application/json" \
  -d '{"nis":"20260101","nama":"Akmal Rizal Pratama","kelas":"XI","jurusan":"Rekayasa Piranti Lunak (RPL)","status":"AKTIF"}'

# Ubah data
curl -X PUT http://localhost:3000/api/siswa/1 \
  -H "Content-Type: application/json" \
  -d '{"nis":"20260101","nama":"Akmal Rizal Pratama","kelas":"XII","jurusan":"Rekayasa Piranti Lunak (RPL)","status":"LULUS"}'

# Hapus data
curl -X DELETE http://localhost:3000/api/siswa/1
```

Balasan sukses: `{"ok": true, "data": { ... }}`.
Balasan gagal: `{"ok": false, "galat": { "nis": "NIS sudah dipakai ..." }}` dengan kode status
**400** (validasi), **404** (tidak ditemukan), atau **409** (NIS duplikat).

## 6. Catatan Teknis

- **Koneksi Aiven selalu pakai SSL.** Parameter `sslmode=require` pada connection string
  dibuang sebelum dipakai `node-postgres`, karena PostgreSQL menolak parameter yang tidak
  dikenal; SSL diaktifkan lewat opsi `ssl` pada `lib/db.ts`.
- **Nilai yang di-`INSERT` selalu di-parameterisasi** (`$1`, `$2`, ...), tidak ada input pengguna yang
  digabungkan ke string SQL, sehingga aman dari SQL injection.
- **Tanggal disimpan sebagai teks** hasil `to_char()` di SQL, supaya tidak bergeser hari akibat
  perbedaan zona waktu.
- **Form memakai controlled input** dan dikirim lewat `fetch` ke REST API. Alasannya, React 19
  me-reset form otomatis setelah sebuah action selesai, dan itu mengosongkan isi `<select>`.

## 7. Perintah yang Tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan di port 3000 |
| `npm run build` | Build versi produksi |
| `npm start` | Menjalankan hasil build produksi |
| `npm run typecheck` | Memeriksa tipe TypeScript tanpa error |

---

## 8. Tangkapan Layar

**Dasbor** — ringkasan data siswa, sebaran per kelas, dan data terbaru.

![Dasbor](docs/gambar/1-dasbor.jpg)

**Data Siswa** — daftar dengan pencarian, filter kelas & status, serta tombol tambah / ubah / hapus.

![Data Siswa](docs/gambar/2-data-siswa.jpg)

**Tambah Data** — formulir yang memvalidasi isi di sisi server.

![Tambah Data](docs/gambar/3-tambah-data.jpg)

**Panduan** — langkah setup Aiven & DBeaver, struktur data, dan daftar endpoint REST.

![Panduan](docs/gambar/4-panduan.jpg)

> Tangkapan layar di atas diambil dalam **mode demo** (PostgreSQL lokal). Setelah
> `.env.local` diisi dengan connection string Aiven, lencana di kanan atas berubah menjadi
> *Terhubung ke PostgreSQL Aiven*.

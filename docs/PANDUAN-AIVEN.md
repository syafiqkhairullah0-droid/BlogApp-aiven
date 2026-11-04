# Panduan: Database MySQL di Aiven.io

Aiven adalah layanan **database terkelola** di cloud. Untuk tugas ini用的是 **MySQL 8** yang
sudah Anda buat di Aiven, dan aplikasinya langsung menulis ke tabel `data_siswa` di database
`defaultdb`.

> Yang sudah ada di akun Anda:
> - Service: **MySQL 8**
> - Host: `mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com`
> - Port: `18521`
> - Database: `defaultdb`
> - Tabel: `data_siswa`
>
> Yang masih perlu: **password user Aiven Anda**, untuk diisi di `.env.local`.

---

## Langkah 1 — Menemukan password user Aiven

1. Buka <https://console.aiven.io> → masuk ke project Anda.
2. Klik service MySQL Anda.
3. Tab **Users & Databases** → lihat daftar user (user bawaan biasanya `avnadmin`).
4. Di sebelah user, klik ikon **Show password** / **Copy** untuk menyalin passwordnya.
   Kalau tidak ada tombol itu, klik **Reset password** lalu buat password baru.
5. Salin juga **Service URI**: tab **Overview** → **Service URI** → pilih **MySQL** →
   **Show connection string**.

## Langkah 2 — Mengisi `.env.local` di project

Buka berkas `.env.local` di root project, lalu ganti `GANTI_PASSWORD` dengan password dari
langkah 1:

```
DATABASE_URL=mysql://avnadmin:PASSWORD_ANDA@mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com:18521/defaultdb?sslmode=require

AIVEN_HOST=mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com
AIVEN_PORT=18521
AIVEN_DATABASE=defaultdb
AIVEN_USER=avnadmin
AIVEN_PASSWORD=PASSWORD_ANDA
```

> Berkas `.env.local` **jangan pernah** di-commit ke Git dan tidak boleh dibagikan.
> Yang dibagikan ke guru cukup kode programnya.

## Langkah 3 — Memastikan tabelnya sudah benar

Tabel `data_siswa` sudah Anda buat di DBeaver. Pastikan strukturnya seperti ini:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT | **AUTO_INCREMENT**, PRIMARY KEY |
| `nis` | VARCHAR(20) | UNIQUE, NOT NULL |
| `nama` | VARCHAR(100) | NOT NULL |
| `kelas` | VARCHAR(10) | NOT NULL |
| `jurusan` | VARCHAR(80) | NOT NULL |
| `status` | ENUM('AKTIF','LULUS','PINDAH','KELUAR') | DEFAULT 'AKTIF' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Kalau `id` belum **AUTO_INCREMENT**, klik kanan tabel di DBeaver → **Alter Table** → centang
**Auto increment** → Save. Tanpa itu, aplikasi tidak bisa menyimpan data (kolom `id` tidak
punya nilai).

Atau jalankan ulang berkas `database/schema-mysql.sql` (perintah `DROP TABLE` di dalamnya
menghapus isi lama, jadi pakai hanya kalau tabelnya memang belum ada datanya).

## Langkah 4 — Menjalankan aplikasi

```bash
npm run dev
```

Buka <http://localhost:3000>. Lencana di kanan atas harus berubah menjadi
**Terhubung ke MySQL Aiven**. Kalau masih tertulis *Mode demo*, berarti `.env.local` masih
berisi `GANTI_PASSWORD` — periksa lagi.

## Langkah 5 — Membuktikan datanya benar-benar masuk

1. Tambah satu data siswa lewat form di aplikasi.
2. Di DBeaver, klik dua kali tabel `data_siswa` → tab **Data** → tekan **F5** (Refresh).
   Data baru langsung terlihat.
3. Sebaliknya, ubah satu baris di DBeaver → **Ctrl+S** → refresh di browser.
   Perubahan langsung muncul di aplikasi.

## Catatan penting

- **SSL wajib.** Aiven mewajibkan koneksi terenkripsi. Karena itu `?sslmode=require` ada di
  `DATABASE_URL`. Jangan dihapus.
- **Port bukan 3306.** Port Aiven untuk service Anda adalah `18521`. Salah port akan
  mendapat pesan *Connection refused*.
- **Firewall.** Tab **Networking** di service Aiven: kalau firewall dinyalakan, tambahkan IP
  publik komputer ini ke daftar *allowed IPs*. Kalau tidak dinyalakan, koneksi dari mana pun
  diperbolehkan (tetap dengan SSL).
- **Service harus RUNNING.** Kalau statusnya *Power off*, nyalakan dulu lewat ikon nyala di
  halaman service.

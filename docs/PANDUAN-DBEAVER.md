# Panduan: Menghubungkan DBeaver ke Database Aiven

DBeaver adalah **client management database** (mirip phpMyAdmin, tapi untuk MySQL/PostgreSQL).
Dipakai untuk melihat dan mengubah isi tabel `data_siswa` secara langsung — termasuk saat
presentasi, untuk menunjukkan bahwa data di aplikasi benar-benar tersimpan di database.

---

## Langkah 1 — Koneksi yang sudah ada

Di DBeaver Anda sudah ada koneksi:

| Kolom | Nilai |
|---|---|
| **Host** | `mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com` |
| **Port** | `18521` |
| **Database** | `defaultdb` |
| **User** | `avnadmin` |
| **SSL** | aktif (CA certificate: `D:\ca.pem`) |

Klik dua kali koneksi itu di **Database Navigator** untuk menyambung.

Kalau ingin membuat koneksi baru dari nol:

1. **Database > New Database Connection** (atau **Ctrl+Alt+Shift+C**).
2. Pilih **MySQL** → **Next**.
3. Tab **Main**:

   | Kolom | Nilai |
   |---|---|
   | Host | `mysql-16d67d9d-achmadsyafiqkh2255-2c63.l.aivencloud.com` |
   | Port | `18521` |
   | Database | `defaultdb` |
   | Username | `avnadmin` |
   | Password | password user Aiven Anda |

4. Tab **SSL**: centang **Use SSL**, isi **SSL CA certificate** dengan `D:\ca.pem`
   (kalau sudah ada, biarkan saja).
5. **Test Connection** → harus muncul *Connection test OK* → **Finish**.

---

## Langkah 2 — Menjalankan berkas SQL

| Berkas | Isi |
|---|---|
| `database/schema-mysql.sql` | Membuat tabel `data_siswa` (AUTO_INCREMENT + indeks) |
| `database/lihat-data-mysql.sql` | 12 query untuk melihat data yang masuk dari aplikasi |

**Cara menjalankan `schema-mysql.sql`:**

1. Klik kanan koneksi di *Database Navigator* → **SQL Editor** (atau **Ctrl+Alt+Enter**).
2. **File > Open** → pilih `database/schema-mysql.sql`.
3. Tekan **Ctrl+Alt+Enter** (**Execute Script**).

> Peringatan: berkas itu diawali `DROP TABLE IF EXISTS data_siswa`, jadi isinya akan
> dihapus. Kalau tabel Anda sudah ada dan berisi data, **jangan** jalankan berkasnya —
> cukup pastikan strukturnya sudah benar (lihat `docs/PANDUAN-AIVEN.md`).

**Cara melihat data yang masuk dari aplikasi:**

1. Buka `database/lihat-data-mysql.sql` di SQL Editor.
2. Blok satu query, lalu klik ikon ▶ (Execute) atau tekan **Ctrl+Enter**.
3. Query paling berguna untuk presentasi:

   ```sql
   -- 10 data terakhir yang diinput dari aplikasi
   SELECT nis, nama, kelas, jurusan, status, created_at AS dimasukkan_pada
   FROM data_siswa
   ORDER BY created_at DESC
   LIMIT 10;
   ```

---

## Langkah 3 — Melihat dan mengubah data dari DBeaver

### Melihat isi tabel

Klik dua kali tabel `data_siswa` → tab **Data**. Data tampil seperti spreadsheet.
Tab **Data Editor** dipakai untuk mengubah isi lalu **Ctrl+S** (Save) untuk menyimpan.

### Menjalankan query

Tab **SQL Editor** untuk mengetik perintah SQL, contoh:

```sql
-- Lihat semua data
SELECT * FROM data_siswa ORDER BY nama;

-- Cari data
SELECT * FROM data_siswa WHERE LOWER(nama) LIKE LOWER('%rizal%');

-- Tambah data
INSERT INTO data_siswa (nis, nama, kelas, jurusan, status)
VALUES ('20261234', 'Budi Santoso', 'XI', 'Rekayasa Piranti Lunak (RPL)', 'AKTIF');

-- Ubah data
UPDATE data_siswa SET status = 'LULUS' WHERE nis = '20230101';

-- Hapus data
DELETE FROM data_siswa WHERE nis = '20261234';
```

### Melihat struktur tabel

Klik kanan tabel `data_siswa` → **View Table** untuk melihat perintah `CREATE TABLE` lengkap
beserta indeksnya.

---

## Langkah 4 — Membuktikan data aplikasi dan DBeaver memakai database yang sama

1. Buka aplikasi di <http://localhost:3000>, tambah satu data siswa.
2. Di DBeaver, klik dua kali tabel `data_siswa` → tab **Data** → tekan **F5**.
   Data baru langsung terlihat.
3. Sebaliknya, ubah satu baris di DBeaver → **Ctrl+S** → refresh di browser.
   Perubahan langsung muncul di aplikasi.

Kalau dua arah ini berjalan, berarti aplikasi dan DBeaver benar-benar memakai database yang
sama.

---

## Pemecahan Masalah

| Gejala | Penyebab & Solusi |
|---|---|
| `Connection refused` | Port salah. Port service ini `18521`, bukan 3306. |
| `SSL connection error` | SSL belum aktif. Tab **SSL** → centang *Use SSL* + isi `D:\ca.pem`. |
| `Access denied for user` | Password salah. Ambil ulang dari Aiven → tab *Users & Databases*. |
| `Unknown database 'defaultdb'` | Ketik nama database persis: `defaultdb`. |
| Tabel `data_siswa` tidak muncul | Berkas SQL belum dijalankan, atau terkoneksi ke database lain. |
| Koneksi terputus setelah beberapa menit | Service Aiven dinonaktifkan, atau firewall aktif. Cek tab **Overview** & **Networking** di Aiven. |

# Dokumentasi REST API — AUREUS

Semua endpoint memakai prefix `/api` dan menggunakan JSON.

| Metode | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/siswa` | Daftar siswa (filter, sortir, paginasi) |
| `GET` | `/api/siswa/{id}` | Detail satu siswa |
| `POST` | `/api/siswa` | Tambah siswa baru |
| `PUT` | `/api/siswa/{id}` | Ubah data siswa |
| `DELETE` | `/api/siswa/{id}` | Hapus data siswa |
| `GET` | `/api/statistik` | Ringkasan data untuk dasbor |

---

## GET /api/siswa

Mengambil daftar siswa.

### Parameter (opsional)

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `q` | string | — | Pencarian pada nama atau NIS (tidak membedakan huruf besar-kecil) |
| `kelas` | string | — | Filter kelas, contoh: `XI` |
| `status` | string | — | `AKTIF`, `LULUS`, `PINDAH`, atau `KELUAR` |
| `sort` | string | `nama` | `nama`, `nis`, `kelas`, atau `dibuat` |
| `order` | string | `asc` | `asc` atau `desc` |
| `page` | number | `1` | Nomor halaman |
| `perPage` | number | `10` | Jumlah data per halaman (5–50) |

### Contoh

```bash
curl "http://localhost:3000/api/siswa?kelas=XI&status=AKTIF&sort=nama&order=desc&page=1&perPage=10"
```

### Balasan

```json
{
  "ok": true,
  "data": [
    {
      "id": 9,
      "nis": "20240101",
      "nama": "Galih Ramadhan",
      "kelas": "XI",
      "jurusan": "Rekayasa Piranti Lunak (RPL)",
      "status": "AKTIF",
      "dibuat_pada": "21/10/2026 07:09"
    }
  ],
  "total": 24,
  "page": 1,
  "perPage": 10,
  "totalHalaman": 3
}
```

---

## GET /api/siswa/{id}

```bash
curl http://localhost:3000/api/siswa/1
```

**200** → `{ "ok": true, "data": { ... } }`
**404** → `{ "ok": false, "pesan": "Data siswa tidak ditemukan." }`

---

## POST /api/siswa

Menambah satu data siswa baru.

### Body (JSON)

```json
{
  "nis": "20260101",
  "nama": "Akmal Rizal Pratama",
  "kelas": "XI",
  "jurusan": "Rekayasa Piranti Lunak (RPL)",
  "status": "AKTIF"
}
```

### Contoh

```bash
curl -X POST http://localhost:3000/api/siswa \
  -H "Content-Type: application/json" \
  -d '{"nis":"20260101","nama":"Akmal Rizal Pratama","kelas":"XI","jurusan":"Rekayasa Piranti Lunak (RPL)","status":"AKTIF"}'
```

### Balasan

**201** → `{ "ok": true, "data": { "id": 25, ... } }`

**400** → validasi gagal, isi `galat` berisi pesan per field:

```json
{
  "ok": false,
  "galat": {
    "nis": "NIS harus terdiri dari 4-20 digit angka.",
    "nama": "Nama minimal 3 karakter.",
    "kelas": "Kelas wajib diisi."
  },
  "nilai": { "nis": "12", "nama": "X", "kelas": "" }
}
```

**409** → NIS sudah dipakai siswa lain:

```json
{ "ok": false, "galat": { "nis": "NIS 20230101 sudah dipakai oleh Akmal Rizal Pratama." } }
```

---

## PUT /api/siswa/{id}

Mengubah data siswa yang sudah ada. Body-nya sama persis dengan `POST`.

```bash
curl -X PUT http://localhost:3000/api/siswa/1 \
  -H "Content-Type: application/json" \
  -d '{"nis":"20230101","nama":"Akmal Rizal Pratama","kelas":"XII","jurusan":"Rekayasa Piranti Lunak (RPL)","status":"LULUS"}'
```

**200** → `{ "ok": true, "data": { ... } }`
**400 / 404 / 409** → sama seperti `POST`.

---

## DELETE /api/siswa/{id}

```bash
curl -X DELETE http://localhost:3000/api/siswa/1
```

**200** → `{ "ok": true }`
**404** → `{ "ok": false, "pesan": "Data siswa tidak ditemukan." }`

---

## GET /api/statistik

Ringkasan untuk dasbor.

```bash
curl http://localhost:3000/api/statistik
```

```json
{
  "ok": true,
  "data": {
    "total": 24,
    "perStatus": [{ "status": "AKTIF", "jumlah": 21 }],
    "perKelas": [{ "kelas": "X", "jumlah": 8 }],
    "terbaru": [ ... ]
  }
}
```

---

## Ringkasan Kode Status

| Kode | Arti |
|---|---|
| `200` | Berhasil |
| `201` | Data baru berhasil dibuat |
| `400` | Validasi gagal (lihat `galat`) |
| `404` | Data dengan `id` tersebut tidak ada |
| `409` | NIS duplikat |
| `500` | Kesalahan database di sisi server |

## Aturan Validasi

| Field | Aturan |
|---|---|
| `nis` | Wajib, 4–20 digit angka, unik antar siswa |
| `nama` | Wajib, minimal 3 karakter |
| `kelas` | Wajib |
| `jurusan` | Wajib |
| `status` | Wajib, salah satu dari `AKTIF` / `LULUS` / `PINDAH` / `KELUAR` |

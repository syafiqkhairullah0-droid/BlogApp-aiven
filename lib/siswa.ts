/**
 * Repository: semua query untuk tabel data siswa ada di file ini.
 * Halaman dan route.ts tidak menulis SQL sendiri.
 *
 * Query ditulis dengan placeholder "?" lalu diterjemahkan oleh driver
 * (lihat lib/db.ts). Perbedaan sintaks antar mesin ditangani oleh
 * `db.dialek`:
 *   PostgreSQL -> tabel sekolah.data_siswa
 *   MySQL      -> tabel data_siswa di database yang sedang terhubung
 */

import { getDb } from './db';
import type {
  DataSiswa,
  FilterSiswa,
  HasilDaftarSiswa,
  Siswa,
  StatistikSiswa,
  StatusSiswa,
} from './types';

const KOLOM_SORT: Record<string, string> = {
  nama: 'nama',
  nis: 'nis',
  kelas: 'kelas',
  dibuat: 'created_at',
};

/** Membangun klausa WHERE; nilainya SELALU di-parameterisasi (aman dari SQL injection). */
function bangunWhere(
  db: Awaited<ReturnType<typeof getDb>>,
  filter: FilterSiswa,
): { where: string; params: unknown[] } {
  const syarat: string[] = [];
  const params: unknown[] = [];

  if (filter.q?.trim()) {
    const pola = `%${filter.q.trim()}%`;
    // Satu placeholder "?" per kemunculan, jadi parameternya diulang.
    params.push(pola, pola);
    syarat.push(`(${db.dialek.cari('nama')} OR ${db.dialek.cari('nis')})`);
  }
  if (filter.kelas) {
    params.push(filter.kelas);
    syarat.push(`kelas = ?`);
  }
  if (filter.status) {
    params.push(filter.status);
    syarat.push(`status = ?`);
  }

  return { where: syarat.length ? `WHERE ${syarat.join(' AND ')}` : '', params };
}

/** Daftar kolom yang diambil, dengan created_at diformat jadi teks. */
function kolom(dialek: { dibuatPada: string }): string {
  return `
    id,
    nis,
    nama,
    kelas,
    jurusan,
    status,
    ${dialek.dibuatPada} AS dibuat_pada
  `;
}

export async function listSiswa(filter: FilterSiswa = {}): Promise<HasilDaftarSiswa> {
  const db = await getDb();
  const tabel = db.dialek.tabel;
  const perPage = Math.min(Math.max(filter.perPage ?? 10, 5), 50);
  const page = Math.max(filter.page ?? 1, 1);
  const { where, params } = bangunWhere(db, filter);

  const totalBaris = await db.query<{ jml: string }>(
    `SELECT ${db.dialek.hitungTeks} AS jml FROM ${tabel} ${where}`,
    params,
  );
  const total = Number(totalBaris.rows[0]?.jml ?? 0);

  const kolomSort = KOLOM_SORT[filter.sort ?? 'nama'] ?? 'nama';
  const arah = filter.order === 'desc' ? 'DESC' : 'ASC';

  // "NULLS LAST" adalah sintaks PostgreSQL. MySQL tidak mengenalnya, jadi
  // hilangkan untuk mode MySQL agar query tidak gagal.
  const nullsLast = db.dialek.bisaReturning ? ' NULLS LAST' : '';

  const hasil = await db.query<Siswa>(
    `SELECT ${kolom(db.dialek)} FROM ${tabel} ${where}
     ORDER BY ${kolomSort} ${arah}${nullsLast}, id ASC
     LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`,
    params,
  );

  return {
    data: hasil.rows,
    total,
    page,
    perPage,
    totalHalaman: Math.max(Math.ceil(total / perPage), 1),
  };
}

export async function getSiswa(id: number): Promise<Siswa | null> {
  const db = await getDb();
  const hasil = await db.query<Siswa>(
    `SELECT ${kolom(db.dialek)} FROM ${db.dialek.tabel} WHERE id = ?`,
    [id],
  );
  return hasil.rows[0] ?? null;
}

export async function getSiswaByNis(nis: string, kecualiId?: number): Promise<Siswa | null> {
  const db = await getDb();

  // Sengaja memakai dua bentuk query, bukan satu query dengan parameter NULL:
  // PostgreSQL tidak bisa menentukan tipe parameter NULL ("could not determine
  // data type of parameter $2").
  const sql =
    kecualiId === undefined
      ? `SELECT ${kolom(db.dialek)} FROM ${db.dialek.tabel} WHERE nis = ? LIMIT 1`
      : `SELECT ${kolom(db.dialek)} FROM ${db.dialek.tabel} WHERE nis = ? AND id <> ? LIMIT 1`;

  const params = kecualiId === undefined ? [nis] : [nis, kecualiId];
  const hasil = await db.query<Siswa>(sql, params);
  return hasil.rows[0] ?? null;
}

export async function createSiswa(data: DataSiswa): Promise<Siswa> {
  const db = await getDb();
  const tabel = db.dialek.tabel;

  // created_at diisi eksplisit (NOW()) supaya tidak bergantung pada default
  // kolom di database.
  const params = [data.nis, data.nama, data.kelas, data.jurusan, data.status];

  const sql = db.dialek.bisaReturning
    ? `INSERT INTO ${tabel} (nis, nama, kelas, jurusan, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW()) RETURNING id`
    : `INSERT INTO ${tabel} (nis, nama, kelas, jurusan, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`;

  const id = await db.insert(sql, params);
  const siswa = await getSiswa(id);
  if (!siswa) throw new Error('Data gagal disimpan.');
  return siswa;
}

export async function updateSiswa(id: number, data: DataSiswa): Promise<Siswa> {
  const db = await getDb();
  const tabel = db.dialek.tabel;
  const params = [data.nis, data.nama, data.kelas, data.jurusan, data.status, id];

  const sql = db.dialek.bisaReturning
    ? `UPDATE ${tabel} SET nis = ?, nama = ?, kelas = ?, jurusan = ?, status = ? WHERE id = ? RETURNING id`
    : `UPDATE ${tabel} SET nis = ?, nama = ?, kelas = ?, jurusan = ?, status = ? WHERE id = ?`;

  const hasil = await db.query<{ id?: number }>(sql, params);
  if (hasil.affected === 0) throw new Error('Data tidak ditemukan.');

  const siswa = await getSiswa(id);
  if (!siswa) throw new Error('Data tidak ditemukan.');
  return siswa;
}

export async function deleteSiswa(id: number): Promise<boolean> {
  const db = await getDb();
  const tabel = db.dialek.tabel;

  // PostgreSQL (termasuk mode demo) mengembalikan baris yang terhapus lewat
  // "RETURNING id". MySQL tidak mendukung RETURNING, jadi dipakai jumlah
  // baris yang terpengaruh (affected rows).
  if (db.dialek.bisaReturning) {
    const hasil = await db.query<{ id: number }>(
      `DELETE FROM ${tabel} WHERE id = ? RETURNING id`,
      [id],
    );
    return hasil.rows.length > 0;
  }

  const hasil = await db.query(`DELETE FROM ${tabel} WHERE id = ?`, [id]);
  return hasil.affected > 0;
}

/** Ringkasan untuk dasbor. */
export async function statistikSiswa(): Promise<StatistikSiswa> {
  const db = await getDb();
  const tabel = db.dialek.tabel;
  const hitung = db.dialek.hitungTeks;

  const [total, perStatus, perKelas, terbaru] = await Promise.all([
    db.query<{ jml: string }>(`SELECT ${hitung} AS jml FROM ${tabel}`),
    db.query<{ status: StatusSiswa; jumlah: string }>(
      `SELECT status, ${hitung} AS jumlah FROM ${tabel} GROUP BY status ORDER BY status`,
    ),
    db.query<{ kelas: string; jumlah: string }>(
      `SELECT kelas, ${hitung} AS jumlah FROM ${tabel} GROUP BY kelas ORDER BY kelas`,
    ),
    db.query<Siswa>(
      `SELECT ${kolom(db.dialek)} FROM ${tabel} ORDER BY created_at DESC, id DESC LIMIT 5`,
    ),
  ]);

  return {
    total: Number(total.rows[0]?.jml ?? 0),
    perStatus: perStatus.rows.map((b) => ({ status: b.status, jumlah: Number(b.jumlah) })),
    perKelas: perKelas.rows.map((b) => ({ kelas: b.kelas, jumlah: Number(b.jumlah) })),
    terbaru: terbaru.rows,
  };
}

/** Daftar kelas yang ada isinya, untuk mengisi dropdown filter. */
export async function opsiKelas(): Promise<string[]> {
  const db = await getDb();
  const hasil = await db.query<{ kelas: string }>(
    `SELECT DISTINCT kelas FROM ${db.dialek.tabel} ORDER BY kelas`,
  );
  return hasil.rows.map((b) => b.kelas);
}

/**
 * Validasi data siswa.
 *
 * Dipakai oleh route.ts supaya aturan yang sama berlaku untuk semua jalur
 * penulisan data, baik dari formulir web maupun dari aplikasi lain.
 */

import type { DataSiswa, StatusSiswa } from './types';

const STATUS_VALID: StatusSiswa[] = ['AKTIF', 'LULUS', 'PINDAH', 'KELUAR'];

/** Membersihkan input mentah (string dari JSON) menjadi bentuk DataSiswa. */
export function normalisasiData(input: Record<string, unknown>): DataSiswa {
  const ambil = (kunci: string): string => {
    const nilai = input?.[kunci];
    if (nilai === null || nilai === undefined) return '';
    return String(nilai).trim();
  };

  return {
    nis: ambil('nis'),
    nama: ambil('nama'),
    kelas: ambil('kelas'),
    jurusan: ambil('jurusan'),
    status: (ambil('status').toUpperCase() || 'AKTIF') as StatusSiswa,
  };
}

/** Mengembalikan daftar galat per field. Array kosong berarti valid. */
export function validasiData(data: DataSiswa): Record<string, string> {
  const galat: Record<string, string> = {};

  if (!data.nis) {
    galat.nis = 'NIS wajib diisi.';
  } else if (!/^[0-9]{4,20}$/.test(data.nis)) {
    galat.nis = 'NIS harus terdiri dari 4-20 digit angka.';
  }

  if (!data.nama) {
    galat.nama = 'Nama lengkap wajib diisi.';
  } else if (data.nama.length < 3) {
    galat.nama = 'Nama minimal 3 karakter.';
  }

  if (!data.kelas) {
    galat.kelas = 'Kelas wajib diisi.';
  }

  if (!data.jurusan) {
    galat.jurusan = 'Jurusan wajib diisi.';
  }

  if (!STATUS_VALID.includes(data.status)) {
    galat.status = 'Pilih status yang tersedia.';
  }

  return galat;
}

/** Menerjemahkan error database (PostgreSQL atau MySQL) menjadi pesan pengguna. */
export function pesanError(err: unknown): string {
  if (err instanceof Error) {
    const m = err.message.toLowerCase();
    if (m.includes('duplicate')) {
      return 'NIS sudah dipakai siswa lain. Gunakan NIS yang berbeda.';
    }
    if (m.includes('check constraint') || m.includes('violated') || m.includes('violates')) {
      return 'Nilai salah satu kolom tidak sesuai aturan database.';
    }
    return `Gagal menyimpan data: ${err.message}`;
  }
  return 'Gagal menyimpan data karena kesalahan yang tidak diketahui.';
}

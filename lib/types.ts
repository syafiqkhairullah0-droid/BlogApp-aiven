/**
 * Tipe data bersama untuk aplikasi AUREUS.
 *
 * Tanggal dibuat_pada sengaja disimpan sebagai TEKS hasil `to_char()` di SQL,
 * bukan tipe Date JavaScript, supaya tidak pernah bergeser satu hari akibat
 * perbedaan zona waktu.
 */

export type StatusSiswa = 'AKTIF' | 'LULUS' | 'PINDAH' | 'KELUAR';

export const STATUS_SISWA: { nilai: StatusSiswa; label: string }[] = [
  { nilai: 'AKTIF', label: 'Aktif' },
  { nilai: 'LULUS', label: 'Lulus' },
  { nilai: 'PINDAH', label: 'Pindah' },
  { nilai: 'KELUAR', label: 'Keluar' },
];

export const KELAS_TERSEDIA = ['X', 'XI', 'XII'] as const;

export const JURUSAN_TERSEDIA = [
  'Rekayasa Perangkat Lunak (RPL)',
  'Teknik Komputer dan Jaringan (TKJ)',
  'Desain Komunikasi Visual (DKV)',
  'Multimedia (DMM)',
  'Akuntansi dan Keuangan (AKL)',
  'Bisnis daring dan Pemasaran (BDP)',
] as const;

/** Satu baris data siswa. */
export interface Siswa {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  status: StatusSiswa;
  /** Format DD/MM/YYYY HH24:MI */
  dibuat_pada: string;
}

/** Data yang dikirim formulir simpan / ubah. */
export interface DataSiswa {
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  status: StatusSiswa;
}

/** Parameter pencarian, sortir, dan paginasi pada daftar siswa. */
export interface FilterSiswa {
  q?: string;
  kelas?: string;
  status?: StatusSiswa | '';
  sort?: 'nama' | 'nis' | 'kelas' | 'dibuat';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface HasilDaftarSiswa {
  data: Siswa[];
  total: number;
  page: number;
  perPage: number;
  totalHalaman: number;
}

export interface StatistikSiswa {
  total: number;
  perStatus: { status: StatusSiswa; jumlah: number }[];
  perKelas: { kelas: string; jumlah: number }[];
  terbaru: Siswa[];
}

/**
 * Bentuk hasil API: galat per field + nilai yang sudah diisi user.
 * Ditempatkan di sini karena berkas route.ts boleh mengekspor tipe seperti ini.
 */
export interface HasilApi {
  ok: boolean;
  pesan?: string;
  galat?: Record<string, string>;
  nilai?: Partial<DataSiswa>;
}

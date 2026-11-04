/**
 * Lapisan koneksi database.
 *
 * Mesin database ditentukan dari skema URL pada DATABASE_URL:
 *   postgresql://...  -> node-postgres (pg)      + dialek PostgreSQL
 *   mysql://...       -> mysql2                   + dialek MySQL
 *   (kosong)          -> PGlite in-memory         + dialek PostgreSQL (mode demo)
 *
 * Dialek menentukan sedikit perbedaan sintaks SQL. Semua query ditulis dengan
 * placeholder "?" lalu diterjemahkan sesuai driver.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type JenisMesin = 'postgres' | 'mysql' | 'demo';

/** Perbedaan sintaks SQL antar mesin. */
export interface Dialek {
  /** Nama tabel yang dipakai (bisa disertai skema/database). */
  tabel: string;
  /** Ekspresi pencarian tidak_case_sensitive, contoh: nama ILIKE ? */
  cari: (kolom: string) => string;
  /** Ekspresi created_at yang sudah diformat DD/MM/YYYY HH24:MI. */
  dibuatPada: string;
  /** Ekspresi COUNT yang menghasilkan teks. */
  hitungTeks: string;
  /** True bila INSERT mendukung "RETURNING id". */
  bisaReturning: boolean;
}

export const DIALEK_POSTGRES: Dialek = {
  tabel: 'sekolah.data_siswa',
  cari: (kolom) => `${kolom} ILIKE ?`,
  dibuatPada: `to_char(created_at AT TIME ZONE 'Asia/Jakarta', 'DD/MM/YYYY HH24:MI')`,
  hitungTeks: 'COUNT(*)::text',
  bisaReturning: true,
};

export const DIALEK_MYSQL: Dialek = {
  tabel: 'data_siswa',
  cari: (kolom) => `LOWER(${kolom}) LIKE LOWER(?)`,
  dibuatPada: `DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+07:00'), '%d/%m/%Y %H:%i')`,
  hitungTeks: 'CAST(COUNT(*) AS CHAR)',
  bisaReturning: false,
};

export interface Db {
  readonly mode: JenisMesin;
  readonly dialek: Dialek;
  /** Menjalankan query. `affected` = jumlah baris yang terpengaruh. */
  query<T = any>(sql: string, params?: unknown[]): Promise<{ rows: T[]; affected: number }>;
  /** Menjalankan INSERT dan mengembalikan id baris baru. */
  insert(sql: string, params?: unknown[]): Promise<number>;
}

type Cache = {
  db?: Db;
  proses?: Promise<Db>;
  status?: { ok: boolean; pesan: string; pada: number };
};

const KUNCI = '__aureus_db_cache__';

function cache(): Cache {
  const g = globalThis as unknown as Record<string, Cache | undefined>;
  if (!g[KUNCI]) g[KUNCI] = {};
  return g[KUNCI]!;
}

/* ------------------------------------------------------------------ */
/* PostgreSQL (node-postgres)                                         */
/* ------------------------------------------------------------------ */

/** Mengubah placeholder "?" menjadi "$1, $2, ..." untuk node-postgres. */
function keDollar(sql: string): string {
  let nomor = 0;
  return sql.replace(/\?/g, () => `$${++nomor}`);
}

function buatPostgres(): Db {
  const mentah = process.env.DATABASE_URL!;
  const url = new URL(mentah);

  // Aiven memberi ?sslmode=require. node-postgres meneruskan query string
  // apa adanya ke server PostgreSQL, dan PostgreSQL menolak parameter yang
  // tidak dikenal -> parameternya dibuang, SSL disetel manual.
  url.searchParams.delete('sslmode');

  const { Pool } = require('pg') as typeof import('pg');
  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });

  pool.on('error', (err) => console.error('[db] error koneksi idle:', err.message));

  return {
    mode: 'postgres',
    dialek: DIALEK_POSTGRES,
    async query<T>(sql: string, params: unknown[] = []) {
      const hasil = await pool.query(keDollar(sql), params as any[]);
      return { rows: hasil.rows as T[], affected: hasil.rowCount ?? 0 };
    },
    async insert(sql: string, params: unknown[] = []) {
      const hasil = await pool.query(keDollar(sql), params as any[]);
      return Number(hasil.rows[0]?.id);
    },
  };
}

/* ------------------------------------------------------------------ */
/* MySQL (mysql2)                                                     */
/* ------------------------------------------------------------------ */

async function buatMysql(): Promise<Db> {
  const mysql = await import('mysql2/promise');
  const url = new URL(process.env.DATABASE_URL!);

  // Aiven mewajibkan SSL. Untuk MySQL lokal (tanpa SSL), pakai ?sslmode=disable.
  const sslMati = url.searchParams.get('sslmode') === 'disable';

  const koneksi = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, '') || undefined,
    ssl: sslMati ? undefined : { rejectUnauthorized: false },
    connectTimeout: 8_000,
  });

  return {
    mode: 'mysql',
    dialek: DIALEK_MYSQL,
    async query<T>(sql: string, params: unknown[] = []) {
      const [hasil] = await koneksi.execute(sql, params as any[]);
      return {
        rows: hasil as T[],
        affected: (hasil as { affectedRows?: number }).affectedRows ?? 0,
      };
    },
    async insert(sql: string, params: unknown[] = []) {
      const [hasil] = await koneksi.execute(sql, params as any[]);
      return Number((hasil as { insertId: number }).insertId);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Mode demo: PGlite (PostgreSQL in-memory)                            */
/* ------------------------------------------------------------------ */

/** Berkas SQL mode demo: definisi database (PostgreSQL). */
const BERKAS_SQL = ['schema.sql'];

function bacaSql(namaBerkas: string): string {
  const kandidat = [
    join(process.cwd(), 'database', namaBerkas),
    join(process.cwd(), '..', 'database', namaBerkas),
  ];
  for (const jalur of kandidat) {
    try {
      return readFileSync(jalur, 'utf8');
    } catch {
      /* coba lokasi berikutnya */
    }
  }
  throw new Error(
    `Berkas SQL "${namaBerkas}" tidak ditemukan. Pastikan folder "database/" ada di root project.`,
  );
}

async function buatDemo(): Promise<Db> {
  const { PGlite } = await import('@electric-sql/pglite');
  const pglite = new PGlite();

  for (const nama of BERKAS_SQL) {
    await pglite.exec(bacaSql(nama));
  }

  return {
    mode: 'demo',
    dialek: DIALEK_POSTGRES,
    async query<T>(sql: string, params: unknown[] = []) {
      const hasil = await pglite.query(keDollar(sql), params as any[]);
      return { rows: hasil.rows as T[], affected: hasil.affectedRows ?? hasil.rows.length };
    },
    async insert(sql: string, params: unknown[] = []) {
      const hasil = await pglite.query(keDollar(sql), params as any[]);
      const baris = hasil.rows as { id?: number }[];
      return Number(baris[0]?.id);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Pemasson                                                             */
/* ------------------------------------------------------------------ */

/** Mesin database menurut skema URL; null berarti tidak terkonfigurasi. */
export function mesinDatabase(): JenisMesin | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (url.startsWith('mysql://')) return 'mysql';
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) return 'postgres';
  return null;
}

/** True bila DATABASE_URL masih berupa nilai contoh (belum diisi user). */
function masihNilaiContoh(): boolean {
  const url = process.env.DATABASE_URL ?? '';
  return (
    url.length === 0 ||
    url.includes('GANTI_PASSWORD') ||
    url.includes('pg-xxxx') ||
    url.includes('mysql-xxxx') ||
    url.includes('PASSWORD@')
  );
}

/**
 * Mengembalikan instance DB, membuatnya bila belum ada.
 *
 * Bila DATABASE_URL terisi tapi database tidak bisa dihubungi, aplikasi
 * otomatis memakai mode demo supaya tetap bisa dibuka.
 */
export async function getDb(): Promise<Db> {
  const c = cache();
  if (c.db) return c.db;
  if (!c.proses) {
    c.proses = (async () => {
      const mesin = mesinDatabase();

      if (mesin && !masihNilaiContoh()) {
        try {
          const db = mesin === 'mysql' ? await buatMysql() : buatPostgres();
          await db.query('SELECT 1');
          c.db = db;
          c.proses = undefined;
          return db;
        } catch (err) {
          const pesan = err instanceof Error ? err.message : 'koneksi ditolak';
          console.warn(
            `[db] ${mesin} tidak dapat dihubungi (${pesan}). Aplikasi memakai mode demo.`,
          );
        }
      }

      const demo = await buatDemo();
      c.db = demo;
      c.proses = undefined;
      return demo;
    })().catch((err) => {
      c.proses = undefined;
      throw err;
    });
  }
  return c.proses;
}

/** Mengecek apakah database bisa dijangkau (di-cache 30 detik). */
export async function cekKoneksiDb(): Promise<{ ok: boolean; pesan: string }> {
  const c = cache();
  const sekarang = Date.now();
  if (c.status && sekarang - c.status.pada < 30_000) {
    return { ok: c.status.ok, pesan: c.status.pesan };
  }

  try {
    const db = await getDb();
    await db.query('SELECT 1');
    const pesan =
      db.mode === 'postgres'
        ? 'Terhubung ke PostgreSQL Aiven'
        : db.mode === 'mysql'
          ? 'Terhubung ke MySQL Lokal (Laragon)'
          : 'Mode demo (PostgreSQL lokal in-memory)';
    c.status = { ok: true, pesan, pada: sekarang };
    return { ok: true, pesan };
  } catch (err) {
    const pesan = err instanceof Error ? err.message : 'Koneksi database gagal';
    c.status = { ok: false, pesan, pada: sekarang };
    return { ok: false, pesan };
  }
}

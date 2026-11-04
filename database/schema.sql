-- =============================================================================
--  AUREUS · Schema Database
--  PostgreSQL di Aiven.io  ·  dijalankan lewat DBeaver
--
--  1. Hubungkan DBeaver ke database Aiven (panduan: docs/PANDUAN-DBEAVER.md)
--  2. Database > SQL Editor > New SQL Script
--  3. Salin file ini, lalu klik Execute Script (Ctrl+Alt+Enter)
-- =============================================================================

--  Schema khusus untuk data tugas sekolah
CREATE SCHEMA IF NOT EXISTS sekolah;

--  Hapus tabel lama bila ingin mulai dari awal
DROP TABLE IF EXISTS sekolah.data_siswa;

--  Tabel data siswa
CREATE TABLE sekolah.data_siswa (
    id         SERIAL       PRIMARY KEY,
    nis        VARCHAR(20)  NOT NULL UNIQUE,
    nama       VARCHAR(100) NOT NULL,
    kelas      VARCHAR(10)  NOT NULL,
    jurusan    VARCHAR(80)  NOT NULL,
    status     VARCHAR(10)  NOT NULL DEFAULT 'AKTIF'
                           CHECK (status IN ('AKTIF', 'LULUS', 'PINDAH', 'KELUAR')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_data_siswa_nama   ON sekolah.data_siswa (nama);
CREATE INDEX idx_data_siswa_kelas  ON sekolah.data_siswa (kelas);
CREATE INDEX idx_data_siswa_status ON sekolah.data_siswa (status);

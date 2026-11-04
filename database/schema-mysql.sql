-- =============================================================================
--  AUREUS · Schema Database (MySQL / MariaDB)
--  Digunakan dengan MySQL lokal (Laragon) dan bisa dibuka lewat DBeaver.
-- =============================================================================

-- 1. Buat database bila belum ada, lalu gunakan database itu.
CREATE DATABASE IF NOT EXISTS db_siswa CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE db_siswa;

-- 2. Hapus tabel lama bila ingin mulai dari awal (perhatian: data akan hilang).
DROP TABLE IF EXISTS data_siswa;

-- 3. Tabel data siswa
CREATE TABLE data_siswa (
    id         INT          NOT NULL AUTO_INCREMENT,
    nis        VARCHAR(20)  NOT NULL UNIQUE,
    nama       VARCHAR(100) NOT NULL,
    kelas      VARCHAR(10)  NOT NULL,
    jurusan    VARCHAR(80)  NOT NULL,
    status     VARCHAR(10)  NOT NULL DEFAULT 'AKTIF'
                 CHECK (status IN ('AKTIF', 'LULUS', 'PINDAH', 'KELUAR')),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Indeks untuk pencarian, filter, dan pengurutan.
CREATE INDEX idx_data_siswa_nama   ON data_siswa (nama);
CREATE INDEX idx_data_siswa_kelas  ON data_siswa (kelas);
CREATE INDEX idx_data_siswa_status ON data_siswa (status);

-- 5. Contoh data awal (hapus dua baris ini jika ingin mulai kosong).
INSERT INTO data_siswa (nis, nama, kelas, jurusan, status)
VALUES
  ('20260101', 'Achmad Syafiq Khairullah', 'XI', 'Rekayasa Perangkat Lunak (RPL)', 'AKTIF'),
  ('20260102', 'Akmal Rizal Pratama', 'XI', 'Teknik Komputer dan Jaringan (TKJ)', 'AKTIF');

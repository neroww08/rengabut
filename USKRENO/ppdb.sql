-- Database PPDB SMK MAARIF NU DOLOPO
-- Jalankan sekali di MySQL (phpMyAdmin atau CLI) untuk membuat database dan tabel.

CREATE DATABASE IF NOT EXISTS smk_maarif_ppdb
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smk_maarif_ppdb;

CREATE TABLE IF NOT EXISTS ppdb_calon_siswa (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama_lengkap VARCHAR(120) NOT NULL,
  nisn CHAR(10) NOT NULL,
  tempat_lahir VARCHAR(80) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('L','P') NOT NULL,
  jurusan VARCHAR(80) NOT NULL,
  alamat TEXT NOT NULL,
  nama_ortu VARCHAR(120) NOT NULL,
  no_hp VARCHAR(20) NOT NULL,
  asal_sekolah VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nisn (nisn),
  KEY idx_jurusan (jurusan),
  KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jurusan yang valid: Rekayasa Perangkat Lunak, Asisten Keperawatan, Teknik Sepeda Motor, Teknik Pengelasan

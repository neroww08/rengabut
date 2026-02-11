<?php
/**
 * Konfigurasi koneksi database MySQL - PPDB SMK MAARIF NU DOLOPO
 * Sesuaikan dengan hosting Anda (nama DB, user, password, host).
 *
 * Setup: pastikan MySQL/MariaDB berjalan, lalu jalankan file ppdb.sql
 * (phpMyAdmin atau: mysql -u root -p < ppdb.sql) untuk membuat database dan tabel.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'smk_maarif_ppdb');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . (DB_CHARSET ? ';charset=' . DB_CHARSET : '');
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            return null;
        }
    }
    return $pdo;
}

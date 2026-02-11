<?php
/**
 * API PPDB - Menyimpan data pendaftaran ke database
 * SMK MAARIF NU DOLOPO
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan.']);
    exit;
}

// Load config (path dari api/ ke config/)
require_once __DIR__ . '/../config/database.php';

$input = $_POST;
// Jika dikirim sebagai JSON (fetch)
if (empty($input) && !empty(file_get_contents('php://input'))) {
    $input = (array) json_decode(file_get_contents('php://input'), true);
}

$required = ['nama_lengkap', 'nisn', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'jurusan', 'alamat', 'nama_ortu', 'no_hp', 'asal_sekolah'];
foreach ($required as $field) {
    if (empty(trim($input[$field] ?? ''))) {
        echo json_encode(['success' => false, 'message' => 'Field wajib kosong: ' . $field]);
        exit;
    }
}

$nama_lengkap = trim($input['nama_lengkap']);
$nisn = preg_replace('/\D/', '', $input['nisn']);
$tempat_lahir = trim($input['tempat_lahir']);
$tanggal_lahir = trim($input['tanggal_lahir']);
$jenis_kelamin = in_array($input['jenis_kelamin'], ['L', 'P']) ? $input['jenis_kelamin'] : '';
$jurusan = trim($input['jurusan']);
$alamat = trim($input['alamat']);
$nama_ortu = trim($input['nama_ortu']);
$no_hp = preg_replace('/\D/', '', $input['no_hp']);
$asal_sekolah = trim($input['asal_sekolah']);

$allowed_jurusan = ['Rekayasa Perangkat Lunak', 'Asisten Keperawatan', 'Teknik Sepeda Motor', 'Teknik Pengelasan'];
if (!in_array($jurusan, $allowed_jurusan)) {
    echo json_encode(['success' => false, 'message' => 'Pilihan jurusan tidak valid.']);
    exit;
}

if (strlen($nisn) !== 10) {
    echo json_encode(['success' => false, 'message' => 'NISN harus 10 digit.']);
    exit;
}

$db = getDB();
if (!$db) {
    echo json_encode([
        'success' => false,
        'message' => 'Database tidak tersedia. Pastikan: (1) MySQL/MariaDB sudah berjalan, (2) database smk_maarif_ppdb sudah dibuat, (3) file ppdb.sql sudah dijalankan. Cek config/database.php (host, user, password).',
    ]);
    exit;
}

try {
    $sql = "INSERT INTO ppdb_calon_siswa (
        nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin,
        jurusan, alamat, nama_ortu, no_hp, asal_sekolah, created_at
    ) VALUES (
        :nama_lengkap, :nisn, :tempat_lahir, :tanggal_lahir, :jenis_kelamin,
        :jurusan, :alamat, :nama_ortu, :no_hp, :asal_sekolah, NOW()
    )";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':nama_lengkap' => $nama_lengkap,
        ':nisn' => $nisn,
        ':tempat_lahir' => $tempat_lahir,
        ':tanggal_lahir' => $tanggal_lahir,
        ':jenis_kelamin' => $jenis_kelamin,
        ':jurusan' => $jurusan,
        ':alamat' => $alamat,
        ':nama_ortu' => $nama_ortu,
        ':no_hp' => $no_hp,
        ':asal_sekolah' => $asal_sekolah,
    ]);
    $id = $db->lastInsertId();
    echo json_encode([
        'success' => true,
        'message' => 'Pendaftaran berhasil disimpan. No. pendaftaran: ' . $id . '. Silakan lanjutkan ke tahap berikutnya yang akan diinformasikan sekolah.',
        'id' => (int) $id,
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'NISN ini sudah terdaftar. Gunakan NISN lain atau hubungi sekolah.']);
    } else {
        error_log('PPDB insert error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data. Silakan coba lagi atau hubungi sekolah.']);
    }
}

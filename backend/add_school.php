<?php
set_exception_handler(function($e){
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
ini_set('display_errors', '0');

// =========================================================================
// ADD SCHOOL — creates a school and its two starting classes (Jr KG, Sr KG),
// both left unassigned (teacher_user_id NULL). Those two classes then show
// up immediately in the existing "Assign to class" dropdown on Add User
// (backend/get_unlinked_classes.php already selects any class with no
// teacher_user_id) — classification lives on the school first, a teacher
// gets linked into one of its classes afterwards, never the other way round.
//
// Protected: only a logged-in superadmin can call this.
//
// NOTE ON address: the schools table may not have an `address` column yet
// — get_schools_list.php only ever selected id/name/ward. If the INSERT
// below fails on that column, run once in phpMyAdmin's SQL tab:
//   ALTER TABLE schools ADD COLUMN address VARCHAR(255) NULL;
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'superadmin') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$name    = trim($input['name'] ?? '');
$ward    = trim($input['ward'] ?? '');
$address = trim($input['address'] ?? '');

if ($name === '' || $ward === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'School name and ward are both required.']);
    exit;
}

$conn = get_db_connection();

$check = $conn->prepare('SELECT id FROM schools WHERE name = ? AND ward = ?');
$check->bind_param('ss', $name, $ward);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    $check->close();
    $conn->close();
    echo json_encode(['status' => 'error', 'message' => 'A school with that name already exists in that ward.']);
    exit;
}
$check->close();

$insert = $conn->prepare('INSERT INTO schools (name, ward, address) VALUES (?, ?, ?)');
$insert->bind_param('sss', $name, $ward, $address);

if (!$insert->execute()) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Could not create the school: ' . $insert->error]);
    $insert->close();
    $conn->close();
    exit;
}
$newSchoolId = $conn->insert_id;
$insert->close();

// Every school in this programme runs exactly Jr KG + Sr KG — create both
// class rows now, unassigned, so they're immediately visible on Add User.
$classInsert = $conn->prepare('INSERT INTO classes (school_id, name) VALUES (?, ?)');
foreach (['Jr KG', 'Sr KG'] as $className) {
    $classInsert->bind_param('is', $newSchoolId, $className);
    $classInsert->execute();
}
$classInsert->close();

$conn->close();

echo json_encode([
    'status' => 'success',
    'school_id' => $newSchoolId,
    'name' => $name,
    'ward' => $ward,
    'address' => $address
]);
?>
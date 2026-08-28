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
// GET MATERIALS — returns every material logged for the teacher's own
// class. This is the actual SELECT counterpart to add_materials.php —
// a previous version of this file (uploaded earlier in this project)
// accidentally contained a copy of add_materials.php's INSERT logic
// instead, which is why "+ Add material" and CSV import were writing
// to the real database while the on-screen list kept reading from
// localStorage instead and never showed any of it.
// =========================================================================

session_start();
header('Content-Type: application/json');

$requestHost = strtok($_SERVER['HTTP_HOST'] ?? '', ':');
$isLocalRequest = in_array($requestHost, ['localhost', '127.0.0.1']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if ($effectiveRole !== 'teacher') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

// Same teacher-to-class resolution used everywhere else in this
// project — including the same fix applied to get_my_class.php and
// import_materials_csv.php: the dev-bypass fallback is hardcoded to
// teacher 49, the one real teacher-to-class link that actually exists
// right now, rather than an unlinked "any teacher" lookup.
if (isset($_SESSION['user_id'])) {
    $teacherId = $_SESSION['user_id'];
} else {
    $teacherId = 49;
}

$classStmt = $conn->prepare("SELECT id FROM classes WHERE teacher_user_id = ? LIMIT 1");
$classStmt->bind_param('i', $teacherId);
$classStmt->execute();
$classRow = $classStmt->get_result()->fetch_assoc();
$classStmt->close();

if (!$classRow) {
    echo json_encode(['status' => 'success', 'materials' => []]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("
    SELECT id, item_name, quantity, received_date, distributed
    FROM materials
    WHERE class_id = ?
    ORDER BY received_date DESC, id DESC
");
$stmt->bind_param('i', $classRow['id']);
$stmt->execute();
$result = $stmt->get_result();

$materials = [];
while ($row = $result->fetch_assoc()) {
    $row['distributed'] = (bool) $row['distributed'];
    $materials[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'materials' => $materials]);
?>
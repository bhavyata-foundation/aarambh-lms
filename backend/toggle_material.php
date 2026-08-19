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
// TOGGLE MATERIAL DISTRIBUTED — flips distributed on/off for one item.
// Reversible on purpose, in case a teacher taps it by mistake.
//
// Checks the material actually belongs to THIS teacher's class before
// touching it — otherwise any logged-in teacher could toggle another
// teacher's materials just by guessing an id.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if ($effectiveRole !== 'teacher') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$materialId = $input['material_id'] ?? null;

if (!$materialId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'material_id is required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

if (isset($_SESSION['user_id'])) {
    $teacherId = $_SESSION['user_id'];
} else {
    $lookup = $conn->query("SELECT id FROM users WHERE role = 'teacher' ORDER BY id LIMIT 1");
    $row = $lookup ? $lookup->fetch_assoc() : null;
    if (!$row) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'No teacher account exists yet.']);
        exit;
    }
    $teacherId = $row['id'];
}

$stmt = $conn->prepare("
    UPDATE materials m
    JOIN classes c ON c.id = m.class_id
    SET m.distributed = NOT m.distributed
    WHERE m.id = ? AND c.teacher_user_id = ?
");
$stmt->bind_param('ii', $materialId, $teacherId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Material not found, or it does not belong to your class.']);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();
echo json_encode(['status' => 'success']);
?>
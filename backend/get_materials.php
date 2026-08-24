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
// GET MATERIALS — returns the logged-in teacher's own materials list,
// newest first.
// =========================================================================

session_start();
header('Content-Type: application/json');

$effectiveRole = $_SESSION['role'] ?? null;

if ($effectiveRole !== 'teacher') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
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
        echo json_encode(['status' => 'success', 'materials' => []]);
        exit;
    }
    $teacherId = $row['id'];
}

$stmt = $conn->prepare("
    SELECT m.id, m.item_name, m.quantity, m.received_date, m.distributed
    FROM materials m
    JOIN classes c ON c.id = m.class_id
    WHERE c.teacher_user_id = ?
    ORDER BY m.received_date DESC, m.id DESC
");
$stmt->bind_param('i', $teacherId);
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
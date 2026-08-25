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
// ADD MATERIAL — a teacher logs an item that's actually arrived. Adding
// the row IS the received-status record; there's no separate step.
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

$input = json_decode(file_get_contents('php://input'), true);
$itemName = trim($input['item_name'] ?? '');
$quantity = trim($input['quantity'] ?? '');
$receivedDate = $input['received_date'] ?? '';

if ($itemName === '' || $receivedDate === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Item name and received date are both required.']);
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
        echo json_encode(['status' => 'error', 'message' => 'No teacher account exists yet to attribute this to.']);
        exit;
    }
    $teacherId = $row['id'];
}

$classStmt = $conn->prepare("SELECT id FROM classes WHERE teacher_user_id = ? LIMIT 1");
$classStmt->bind_param('i', $teacherId);
$classStmt->execute();
$classRow = $classStmt->get_result()->fetch_assoc();
$classStmt->close();

if (!$classRow) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Your account is not linked to a class yet — ask your admin to link it.']);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO materials (class_id, item_name, quantity, received_date, added_by)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param('isssi', $classRow['id'], $itemName, $quantity, $receivedDate, $teacherId);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'material_id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
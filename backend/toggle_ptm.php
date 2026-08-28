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
// TOGGLE PTM PREP ITEM — a teacher can only check off items on HER OWN
// prep checklist (for_role = 'teacher'); a supervisor/superadmin can
// only check off the supervisor's checklist (for_role = 'supervisor').
// This is what stops a teacher from marking the supervisor's own
// preparation as done, and vice versa.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if (!in_array($effectiveRole, ['teacher', 'supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$itemId = $input['item_id'] ?? null;

if (!$itemId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'item_id is required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$check = $conn->prepare("SELECT for_role FROM ptm_prep_items WHERE id = ?");
$check->bind_param('i', $itemId);
$check->execute();
$row = $check->get_result()->fetch_assoc();
$check->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Prep item not found.']);
    $conn->close();
    exit;
}

$allowed = ($effectiveRole === 'teacher' && $row['for_role'] === 'teacher')
    || (in_array($effectiveRole, ['supervisor', 'superadmin'], true) && $row['for_role'] === 'supervisor');

if (!$allowed) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'You can only check off your own preparation items.']);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("UPDATE ptm_prep_items SET is_done = NOT is_done WHERE id = ?");
$stmt->bind_param('i', $itemId);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['status' => 'success']);
?>
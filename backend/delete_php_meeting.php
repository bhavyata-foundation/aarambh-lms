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
// DELETE PTM MEETING — for correcting a mistaken entry. Deleting the
// meeting row cascades to its objectives and prep items automatically
// (ON DELETE CASCADE, set in ptm_schema.sql) — nothing orphaned.
// Same role restriction as scheduling one: only supervisor/superadmin.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if (!in_array($effectiveRole, ['supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Only a supervisor or superadmin can delete a PTM.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$meetingId = $input['meeting_id'] ?? null;

if (!$meetingId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'meeting_id is required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$stmt = $conn->prepare("DELETE FROM ptm_meetings WHERE id = ?");
$stmt->bind_param('i', $meetingId);
$stmt->execute();
$deleted = $stmt->affected_rows > 0;
$stmt->close();
$conn->close();

if (!$deleted) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'That PTM meeting was not found — it may already be deleted.']);
    exit;
}

echo json_encode(['status' => 'success']);
?>
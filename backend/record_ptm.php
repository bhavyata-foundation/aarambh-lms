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
// RECORD PTM OUTCOME — marks a meeting 'held' and records how many
// households actually attended. Either the teacher (who was there) or
// the supervisor/superadmin can record this after the fact.
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
$meetingId = $input['meeting_id'] ?? null;
$attendedCount = $input['attended_count'] ?? null;

if (!$meetingId || $attendedCount === null) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'meeting_id and attended_count are both required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$attendedCount = (int) $attendedCount;
$stmt = $conn->prepare("UPDATE ptm_meetings SET status = 'held', attended_count = ? WHERE id = ?");
$stmt->bind_param('ii', $attendedCount, $meetingId);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['status' => 'success']);
?>
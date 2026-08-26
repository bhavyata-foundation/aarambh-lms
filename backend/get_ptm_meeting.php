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
// GET PTM MEETING — returns the most recent PTM meeting for a school
// (and optionally one class), plus its agenda objectives and prep
// checklist. Read access is open to every real role in the programme —
// teacher, principal, supervisor, superadmin — since everyone needs to
// see the same calendar. Only save_ptm_meeting.php (the "deciding" part)
// is restricted to supervisor/superadmin.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if (!in_array($effectiveRole, ['teacher', 'supervisor', 'superadmin', 'principal'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

$schoolId = $_GET['school_id'] ?? null;
$classId = $_GET['class_id'] ?? null;

if (!$schoolId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'school_id is required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

if ($classId) {
    $stmt = $conn->prepare("SELECT * FROM ptm_meetings WHERE school_id = ? AND class_id = ? ORDER BY meeting_date DESC LIMIT 1");
    $stmt->bind_param('ii', $schoolId, $classId);
} else {
    $stmt = $conn->prepare("SELECT * FROM ptm_meetings WHERE school_id = ? AND class_id IS NULL ORDER BY meeting_date DESC LIMIT 1");
    $stmt->bind_param('i', $schoolId);
}
$stmt->execute();
$meeting = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$meeting) {
    echo json_encode(['status' => 'success', 'meeting' => null]);
    $conn->close();
    exit;
}

$objStmt = $conn->prepare("SELECT id, objective_text FROM ptm_objectives WHERE ptm_meeting_id = ? ORDER BY sort_order");
$objStmt->bind_param('i', $meeting['id']);
$objStmt->execute();
$objectives = [];
$objResult = $objStmt->get_result();
while ($row = $objResult->fetch_assoc()) { $objectives[] = $row; }
$objStmt->close();

$prepStmt = $conn->prepare("SELECT id, for_role, item_text, is_done FROM ptm_prep_items WHERE ptm_meeting_id = ? ORDER BY for_role, sort_order");
$prepStmt->bind_param('i', $meeting['id']);
$prepStmt->execute();
$prepItems = [];
$prepResult = $prepStmt->get_result();
while ($row = $prepResult->fetch_assoc()) { $prepItems[] = $row; }
$prepStmt->close();

$conn->close();

$meeting['objectives'] = $objectives;
$meeting['prep_items'] = $prepItems;

echo json_encode(['status' => 'success', 'meeting' => $meeting]);
?>
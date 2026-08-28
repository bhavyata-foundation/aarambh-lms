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
// SAVE PTM MEETING — this IS "the supervisor deciding the event." Only a
// supervisor or superadmin can call this. Creates a new meeting row plus
// its objectives and prep-checklist items in one go (each schedule/edit
// creates a fresh meeting row rather than mutating an old one, so the
// history of past meetings stays intact for the calendar).
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if (!in_array($effectiveRole, ['supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Only a supervisor or superadmin can schedule a PTM.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) { $input = []; }

$schoolId      = $input['school_id'] ?? null;
$classId       = $input['class_id'] ?? null;
$meetingDate   = trim($input['meeting_date'] ?? '');
$meetingTime   = trim($input['meeting_time'] ?? '2:30 PM');
$venue         = trim($input['venue'] ?? 'Classroom');
$invitedCount  = (int) ($input['invited_count'] ?? 0);
$objectives    = is_array($input['objectives'] ?? null) ? $input['objectives'] : [];
$teacherPrep   = is_array($input['teacher_prep'] ?? null) ? $input['teacher_prep'] : [];
$supervisorPrep = is_array($input['supervisor_prep'] ?? null) ? $input['supervisor_prep'] : [];

if (!$schoolId || $meetingDate === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'school_id and meeting_date are both required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

// Dev-mode fallback (no real login session): attribute to any real
// supervisor/superadmin account, same convention as add_event.php.
if (isset($_SESSION['user_id'])) {
    $effectiveUserId = $_SESSION['user_id'];
} else {
    $lookup = $conn->query("SELECT id FROM users WHERE role IN ('supervisor','superadmin') ORDER BY id LIMIT 1");
    $row = $lookup ? $lookup->fetch_assoc() : null;
    if (!$row) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'No supervisor or superadmin account exists yet to attribute this to.']);
        exit;
    }
    $effectiveUserId = $row['id'];
}

$stmt = $conn->prepare("
    INSERT INTO ptm_meetings (school_id, class_id, meeting_date, meeting_time, venue, invited_count, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param('iisssii', $schoolId, $classId, $meetingDate, $meetingTime, $venue, $invitedCount, $effectiveUserId);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Could not create the meeting: ' . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}
$meetingId = $conn->insert_id;
$stmt->close();

$objStmt = $conn->prepare("INSERT INTO ptm_objectives (ptm_meeting_id, objective_text, sort_order) VALUES (?, ?, ?)");
foreach ($objectives as $i => $text) {
    $text = trim((string) $text);
    if ($text === '') { continue; }
    $objStmt->bind_param('isi', $meetingId, $text, $i);
    $objStmt->execute();
}
$objStmt->close();

$prepStmt = $conn->prepare("INSERT INTO ptm_prep_items (ptm_meeting_id, for_role, item_text, sort_order) VALUES (?, ?, ?, ?)");
$teacherRole = 'teacher';
foreach ($teacherPrep as $i => $text) {
    $text = trim((string) $text);
    if ($text === '') { continue; }
    $prepStmt->bind_param('issi', $meetingId, $teacherRole, $text, $i);
    $prepStmt->execute();
}
$supervisorRole = 'supervisor';
foreach ($supervisorPrep as $i => $text) {
    $text = trim((string) $text);
    if ($text === '') { continue; }
    $prepStmt->bind_param('issi', $meetingId, $supervisorRole, $text, $i);
    $prepStmt->execute();
}
$prepStmt->close();

$conn->close();
echo json_encode(['status' => 'success', 'meeting_id' => $meetingId]);
?>
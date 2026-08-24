<?php
// Converts ANY uncaught PHP error into a real JSON error message instead
// of raw error text — without this, a single unexpected failure breaks
// the frontend's JSON parsing entirely and just shows a generic
// "could not reach the server" message that hides the real cause.
set_exception_handler(function($e){
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// display_errors is turned off deliberately — a stray PHP warning or
// deprecation notice printed as plain text would corrupt the JSON
// response just enough to break the frontend, even if the actual
// database operation succeeded. Real errors still surface through
// the exception handler above, which returns clean JSON.
ini_set('display_errors', '0');

// =========================================================================
// ADD EVENT — creates a PTM, teacher training, or other scheduled event.
// Only a supervisor or superadmin can create one — server-side check,
// same principle as every other protected action in this project.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;
$effectiveUserId = $_SESSION['user_id'] ?? null; // resolved properly below, once a real database connection exists

if (!in_array($effectiveRole, ['supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$schoolId  = $input['school_id'] ?? null;
$classId   = $input['class_id'] ?? null;   // null = whole-school event
$eventType = $input['event_type'] ?? '';
$eventDate = $input['event_date'] ?? '';
$eventTime = $input['event_time'] ?? null;
$title     = trim($input['title'] ?? '');
$notes     = trim($input['notes'] ?? '');

if (!$schoolId || !$eventDate || $title === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'School, date, and title are required.']);
    exit;
}

if (!in_array($eventType, ['PTM', 'Teacher Training', 'Other'], true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid event type.']);
    exit;
}

$conn = get_db_connection();

// Dev-mode fallback (no real login session): rather than guessing a
// hardcoded user id that may not actually exist — which is exactly
// what caused the earlier foreign key error — look up any real
// supervisor/superadmin account to attribute the event to instead.
if (!isset($_SESSION['user_id'])) {
    $lookup = $conn->query("SELECT id FROM users WHERE role IN ('supervisor','superadmin') ORDER BY id LIMIT 1");
    $row = $lookup ? $lookup->fetch_assoc() : null;
    if (!$row) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'No supervisor or superadmin account exists yet to attribute this event to.']);
        exit;
    }
    $effectiveUserId = $row['id'];
}

$stmt = $conn->prepare("
    INSERT INTO events (school_id, class_id, event_type, event_date, event_time, title, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    'iisssssi',
    $schoolId, $classId, $eventType, $eventDate, $eventTime, $title, $notes, $effectiveUserId
);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'event_id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
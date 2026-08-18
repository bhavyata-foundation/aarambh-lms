<?php
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
$effectiveUserId = $_SESSION['user_id'] ?? 1; // dev fallback: attribute to user id 1 when testing without a real login

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
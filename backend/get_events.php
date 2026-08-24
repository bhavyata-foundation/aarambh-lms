<?php
// Converts ANY uncaught PHP error into a real JSON error message instead
// of raw error text, so a failure never silently breaks the frontend.
set_exception_handler(function($e){
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
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
// GET EVENTS — returns events, scoped to who's asking:
//   - teacher:    only events for HER school (school-wide events, where
//                 class_id IS NULL) plus events aimed specifically at
//                 her own class_id. Never sees other schools' events.
//   - supervisor: all events (a supervisor oversees multiple schools).
//   - superadmin: all events, same as supervisor.
//
// Optional ?school_id= filter narrows it further for supervisor/superadmin
// views that want to look at one school at a time.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$role = $_SESSION['role'] ?? null;
$events = [];

if ($role === 'teacher') {
    // Find this teacher's class(es) first, then pull events for those
    // schools — either school-wide (class_id IS NULL) or aimed at her
    // specific class.
    $classStmt = $conn->prepare("SELECT id, school_id FROM classes WHERE teacher_user_id = ?");
    $classStmt->bind_param('i', $_SESSION['user_id']);
    $classStmt->execute();
    $classResult = $classStmt->get_result();

    $classIds = [];
    $schoolIds = [];
    while ($row = $classResult->fetch_assoc()) {
        $classIds[] = $row['id'];
        $schoolIds[] = $row['school_id'];
    }
    $classStmt->close();

    if (empty($schoolIds)) {
        echo json_encode(['status' => 'success', 'events' => []]);
        exit;
    }

    $schoolPlaceholders = implode(',', array_fill(0, count($schoolIds), '?'));
    $classPlaceholders  = implode(',', array_fill(0, count($classIds), '?'));
    $types = str_repeat('i', count($schoolIds)) . str_repeat('i', count($classIds));

    $sql = "
        SELECT e.id, e.event_type, e.event_date, e.event_time, e.title, e.notes,
               s.name AS school_name, c.name AS class_name
        FROM events e
        JOIN schools s ON s.id = e.school_id
        LEFT JOIN classes c ON c.id = e.class_id
        WHERE e.school_id IN ($schoolPlaceholders)
          AND (e.class_id IS NULL OR e.class_id IN ($classPlaceholders))
        ORDER BY e.event_date ASC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...array_merge($schoolIds, $classIds));
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) $events[] = $row;
    $stmt->close();

} elseif (in_array($role, ['supervisor', 'superadmin'], true)) {
    $schoolFilter = $_GET['school_id'] ?? null;

    $sql = "
        SELECT e.id, e.event_type, e.event_date, e.event_time, e.title, e.notes,
               s.name AS school_name, c.name AS class_name, u.name AS created_by_name
        FROM events e
        JOIN schools s ON s.id = e.school_id
        LEFT JOIN classes c ON c.id = e.class_id
        JOIN users u ON u.id = e.created_by
    " . ($schoolFilter ? "WHERE e.school_id = ?" : "") . "
        ORDER BY e.event_date ASC
    ";
    $stmt = $conn->prepare($sql);
    if ($schoolFilter) $stmt->bind_param('i', $schoolFilter);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) $events[] = $row;
    $stmt->close();

} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

$conn->close();
echo json_encode(['status' => 'success', 'events' => $events]);
?>
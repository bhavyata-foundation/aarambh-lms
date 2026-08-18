<?php
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

// -------------------------------------------------------------------------
// DEV BYPASS — same pattern as session_check.php. The "skip login" button
// never creates a real PHP session, so $_SESSION is genuinely empty when
// testing this way. On localhost with ?dev_role=teacher present, this
// treats the request as that role WITHOUT a real user_id — since a fake
// dev session has no real class link, the teacher branch below just
// returns every event as a testing convenience, not real per-teacher
// scoping. Does nothing outside localhost.
// -------------------------------------------------------------------------
$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;

if (!$devRole && !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$role = $_SESSION['role'] ?? $devRole;
$events = [];

if ($role === 'teacher' && !isset($_SESSION['user_id'])) {
    // Dev-mode teacher session with no real user_id to look up a class
    // for — just return every event as a testing convenience.
    $result = $conn->query("
        SELECT e.id, e.event_type, e.event_date, e.event_time, e.title, e.notes,
               s.name AS school_name, c.name AS class_name
        FROM events e
        JOIN schools s ON s.id = e.school_id
        LEFT JOIN classes c ON c.id = e.class_id
        ORDER BY e.event_date ASC
    ");
    while ($row = $result->fetch_assoc()) $events[] = $row;

} elseif ($role === 'teacher') {
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
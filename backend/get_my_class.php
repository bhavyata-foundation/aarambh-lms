<?php
// =========================================================================
// GET MY CLASS — returns the logged-in teacher's own class (school_id,
// class_id, class name). Needed so the teacher's dashboard can filter
// events, attendance, and anything else down to just her school/class
// instead of seeing everything in the database.
//
// A teacher can own more than one class (e.g. Jr KG + Sr KG) — this
// returns ALL classes linked to her account, not just one.
//
// DEV BYPASS — same pattern as session_check.php, add_materials.php,
// toggle_material.php etc. ?dev_role=teacher on localhost has no real
// $_SESSION['user_id'] to look up a class for, so this falls back to a
// real teacher account that actually has a class linked to it — a
// testing convenience only, never real per-teacher scoping. Does
// nothing outside localhost.
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

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

if (isset($_SESSION['user_id'])) {
    $teacherId = $_SESSION['user_id'];
} else {
    // Dev-mode bypass has no real user_id — hardcoded to teacher 49
    // (Reena Chinchankar), the one real teacher-to-class link that
    // actually exists in this database right now (class 47, school 1).
    // Once more classes are linked, switch this back to the "any
    // linked teacher" lookup query.
    $teacherId = 49;
}

$stmt = $conn->prepare("
    SELECT c.id AS class_id, c.name AS class_name, c.school_id, s.name AS school_name
    FROM classes c
    JOIN schools s ON s.id = c.school_id
    WHERE c.teacher_user_id = ?
");
$stmt->bind_param('i', $teacherId);
$stmt->execute();
$result = $stmt->get_result();

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'classes' => $classes, 'debug_teacherId_used' => $teacherId]);
?>
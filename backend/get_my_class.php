<?php
// =========================================================================
// GET MY CLASS — returns the logged-in teacher's own class (school_id,
// class_id, class name). Needed so the teacher's dashboard can filter
// events, attendance, and anything else down to just her school/class
// instead of seeing everything in the database.
//
// A teacher can own more than one class (e.g. Jr KG + Sr KG) — this
// returns ALL classes linked to her account, not just one.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$stmt = $conn->prepare("
    SELECT c.id AS class_id, c.name AS class_name, c.school_id, s.name AS school_name
    FROM classes c
    JOIN schools s ON s.id = c.school_id
    WHERE c.teacher_user_id = ?
");
$stmt->bind_param('i', $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'classes' => $classes]);
?>
<?php
// =========================================================================
// GET UNLINKED CLASSES — feeds the "Assign to class" dropdown on the
// Add User screen. Only returns classes that don't have a teacher
// account linked yet (teacher_user_id IS NULL) — this is what stops
// an admin from accidentally double-assigning a class that already
// has a real teacher.
//
// Protected: only a logged-in superadmin can call this.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'superadmin') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$result = $conn->query("
    SELECT c.id, c.name, s.name AS school_name
    FROM classes c
    JOIN schools s ON s.id = c.school_id
    WHERE c.teacher_user_id IS NULL
    ORDER BY s.name, c.name
");

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

$conn->close();

echo json_encode(['status' => 'success', 'classes' => $classes]);
?>
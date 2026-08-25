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
// GET CLASSES FOR SCHOOL — returns the real classes at one school, so
// the Add Event form can offer "whole school" or a specific class.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if (!in_array($effectiveRole, ['supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

$schoolId = $_GET['school_id'] ?? null;
if (!$schoolId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'school_id is required.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$stmt = $conn->prepare("
    SELECT c.id, c.name, COALESCE(u.name, c.teacher_name_pending, 'Unassigned') AS teacher_name
    FROM classes c
    LEFT JOIN users u ON u.id = c.teacher_user_id
    WHERE c.school_id = ?
    ORDER BY c.name
");
$stmt->bind_param('i', $schoolId);
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
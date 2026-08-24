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
// GET SCHOOLS LIST — returns every real school (id, name, ward).
// Used to populate the "which school" dropdown on the Add Event form.
//
// KNOWN LIMITATION: this returns ALL schools, not just the ones
// assigned to the logged-in supervisor — the supervisor-to-school
// assignment link hasn't been built yet (deferred earlier in this
// project). Tighten this once that link exists, by filtering on
// schools.supervisor_user_id = session's user_id.
// =========================================================================

session_start();
header('Content-Type: application/json');

$effectiveRole = $_SESSION['role'] ?? null;

if (!in_array($effectiveRole, ['supervisor', 'superadmin'], true)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$result = $conn->query("SELECT id, name, ward FROM schools ORDER BY name");
$schools = [];
while ($row = $result->fetch_assoc()) {
    $schools[] = $row;
}

$conn->close();
echo json_encode(['status' => 'success', 'schools' => $schools]);
?>
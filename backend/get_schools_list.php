<?php
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

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

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
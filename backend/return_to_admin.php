<?php
set_exception_handler(function($e){
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});
ini_set('display_errors', '0');

// =========================================================================
// RETURN TO ADMIN — restores the real superadmin session saved by
// preview_as.php. Only works if a preview is actually active
// ($_SESSION['preview_original'] set) — calling this with no active
// preview just returns an error, it can't be used to escalate anything.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['preview_original'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No active preview to return from.']);
    exit;
}

$original = $_SESSION['preview_original'];
$_SESSION['user_id'] = $original['user_id'];
$_SESSION['name']    = $original['name'];
$_SESSION['email']   = $original['email'];
$_SESSION['role']    = $original['role'];
unset($_SESSION['preview_original']);

echo json_encode(['status' => 'success']);
?>
<?php
// =========================================================================
// SESSION CHECK — every protected page (dashboard, superadmin, supervisor,
// parent) calls this on load. If it says 'not_logged_in', the page's JS
// redirects back to the login screen.
//
// is_previewing tells the page whether this session is a superadmin
// currently previewing another role (see preview_as.php) — pages use
// this to show a small "Return to Super Admin" banner.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'not_logged_in']);
    exit;
}

echo json_encode([
    'status'         => 'logged_in',
    'name'           => $_SESSION['name'],
    'email'          => $_SESSION['email'],
    'role'           => $_SESSION['role'],
    'is_previewing'  => isset($_SESSION['preview_original'])
]);
?>
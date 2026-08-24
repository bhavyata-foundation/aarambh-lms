<?php
// =========================================================================
// SESSION CHECK — every protected page (dashboard, superadmin, supervisor,
// parent) calls this on load. If it says 'not_logged_in', the page's JS
// redirects back to the login screen.
//
// is_previewing tells the page whether this session is a superadmin
// currently previewing another role (see preview_as.php) — pages use
// this to show a small "Return to Super Admin" banner. Always false in
// the dev-bypass branch below, since that's never a real session.
//
// DEV BYPASS: while ?dev_role=teacher (or supervisor/superadmin/parent) is
// present in the URL AND the request is coming from localhost, this
// skips real authentication entirely and pretends you're already logged
// in as that role — no username/password needed while you iterate on
// the frontend.
//
// This bypass is intentionally self-limiting: it checks the actual
// request host, not just a flag someone could forget to flip. If this
// file ever ends up on a real domain by mistake, the host check fails
// and it falls straight through to real authentication — it does
// nothing there. Still, delete this bypass block before going live,
// as a second layer of safety, not because it's strictly required.
// =========================================================================

session_start();
header('Content-Type: application/json');

$isLocalRequest = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', '127.0.0.1:80']);

if ($isLocalRequest && isset($_GET['dev_role'])) {
    $devRole = $_GET['dev_role'];
    if (in_array($devRole, ['teacher', 'supervisor', 'superadmin', 'parent'], true)) {
        echo json_encode([
            'status' => 'logged_in',
            'name'   => 'Dev Preview (' . $devRole . ')',
            'email'  => 'dev@localhost',
            'role'   => $devRole,
            'is_previewing' => false
        ]);
        exit;
    }
}

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
<?php
set_exception_handler(function($e){
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
ini_set('display_errors', '0');

// =========================================================================
// PREVIEW AS — lets an authenticated superadmin temporarily switch their
// own session to view the app as Teacher, Supervisor, or Parent, without
// logging out or needing a second password.
//
// This is NOT a login bypass: it only works if $_SESSION['role'] is
// ALREADY 'superadmin' from a real, normal login — that value is only
// ever set server-side by login.php, never something a client can fake
// by editing a URL or request body. Once previewing, this same check
// naturally blocks calling it a second time (the session's role is no
// longer 'superadmin' until they return), so a preview can't be used to
// hop between roles without going back to Super Admin first.
//
// Previews as one of the fixed test accounts created earlier
// (test.teacher@ / test.supervisor@ / test.parent@) — not an arbitrary
// real teacher's account, so this never exposes a real person's actual
// session.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'superadmin') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Only a logged-in superadmin can preview as another role.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$targetRole = $input['role'] ?? '';

$previewEmails = [
    'teacher'    => 'test.teacher@bhavyatafoundation.com',
    'supervisor' => 'test.supervisor@bhavyatafoundation.com',
    'parent'     => 'test.parent@bhavyatafoundation.com',
];

if (!isset($previewEmails[$targetRole])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid preview role.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

$stmt = $conn->prepare('SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1');
$email = $previewEmails[$targetRole];
$stmt->bind_param('s', $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

if (!$user) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => "No test $targetRole account exists yet (expected $email)."]);
    exit;
}

// Remember the real superadmin identity so "Return to Super Admin" can
// restore it exactly — only set this the FIRST time, so switching
// straight from one preview to another (after returning in between)
// never loses the original account.
if (!isset($_SESSION['preview_original'])) {
    $_SESSION['preview_original'] = [
        'user_id' => $_SESSION['user_id'],
        'name'    => $_SESSION['name'],
        'email'   => $_SESSION['email'],
        'role'    => $_SESSION['role'],
    ];
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['role']    = $user['role'];

$redirectPage = [
    'teacher'    => 'index.html',
    'supervisor' => 'supervisor.html',
    'parent'     => 'parent.html',
][$targetRole];

echo json_encode(['status' => 'success', 'redirect' => $redirectPage]);
?>
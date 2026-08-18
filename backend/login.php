<?php
// =========================================================================
// LOGIN — checks credentials, starts a session, returns the real role.
//
// IMPORTANT: the role returned here comes from the database, never from
// whatever the browser sent. This is what actually stops someone from
// clicking "Super Admin" in the UI and getting in without real admin
// credentials — the frontend's role picker is just a visual hint now,
// not a security decision.
// =========================================================================

session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Email and password are both required.']);
    exit;
}

$conn = get_db_connection();

$stmt = $conn->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Incorrect email or password.']);
    exit;
}

// Credentials check out — start the session. Everything after this point,
// on every page, trusts THIS session data, never anything the browser
// sends about who it claims to be.
$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['role']    = $user['role'];

echo json_encode([
    'status' => 'success',
    'name'   => $user['name'],
    'role'   => $user['role']
]);
?>
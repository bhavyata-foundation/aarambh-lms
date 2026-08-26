<?php
// =========================================================================
// ADD USER — creates a real login from the Super Admin UI, no code
// editing needed. This is what replaces manually running
// create_account.php from now on.
//
// Protected: only a logged-in superadmin can call this — this is a
// server-side check, so it can't be bypassed by hiding the button in
// the browser.
// =========================================================================

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'superadmin') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

require_once __DIR__ . '/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$role = $input['role'] ?? '';
$classId = $input['class_id'] ?? null;
$schoolId = $input['school_id'] ?? null; // used for the principal role

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Name and email are both required.']);
    exit;
}

if (!in_array($role, ['teacher', 'supervisor', 'superadmin', 'parent', 'principal'], true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid role.']);
    exit;
}

$conn = get_db_connection();

$check = $conn->prepare('SELECT id FROM users WHERE email = ?');
$check->bind_param('s', $email);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    $check->close();
    $conn->close();
    echo json_encode(['status' => 'error', 'message' => 'An account with that email already exists.']);
    exit;
}
$check->close();

// Generate a temporary password — first name + 3 random digits + a
// fixed pattern. Memorable and tied to the person, but not literally
// their name alone (which is public on the same roster), so it isn't
// trivially guessable by someone who just knows who works there.
function generate_temp_password($fullName){
    $first = preg_split('/\s+/', trim($fullName))[0];
    $first = preg_replace('/[^a-zA-Z]/', '', $first);
    $first = ucfirst(strtolower($first));
    if ($first === '') $first = 'Bhavyata';
    $digits = str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT);
    return $first . $digits . '@1';
}

$tempPassword = generate_temp_password($name);

$hash = password_hash($tempPassword, PASSWORD_BCRYPT);

if ($role === 'principal' && !empty($schoolId)) {
    $insert = $conn->prepare('INSERT INTO users (name, email, password_hash, role, school_id) VALUES (?, ?, ?, ?, ?)');
    $insert->bind_param('ssssi', $name, $email, $hash, $role, $schoolId);
} else {
    $insert = $conn->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $insert->bind_param('ssss', $name, $email, $hash, $role);
}

if (!$insert->execute()) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Could not create the account: ' . $insert->error]);
    $insert->close();
    $conn->close();
    exit;
}
$newUserId = $conn->insert_id;
$insert->close();

// If a class was selected (teacher role), link it — but only if that
// class doesn't already have a teacher, to prevent a race where two
// admins try to assign the same class at once.
if ($role === 'teacher' && !empty($classId)) {
    $link = $conn->prepare('UPDATE classes SET teacher_user_id = ? WHERE id = ? AND teacher_user_id IS NULL');
    $link->bind_param('ii', $newUserId, $classId);
    $link->execute();
    $link->close();
}

$conn->close();

echo json_encode([
    'status' => 'success',
    'email' => $email,
    'temp_password' => $tempPassword
]);
?>
<?php
// =========================================================================
// CREATE ACCOUNT — one-time bootstrap tool. Use this ONLY to create your
// very first Super Admin login — every account after this one should be
// created through the "Add User" screen inside superadmin.html instead,
// once you're logged in.
//
// Note: the real `users` table also has contact_no, blood_group,
// leaves_pending, status, and created_at columns beyond the 4 the
// original version of this file assumed — all filled in below with
// safe defaults (NULL, NULL, 0, 'active', NOW()), the same values
// confirmed to work via a manual test insert.
//
// HOW TO USE:
// 1. The 4 values below are already filled in with your real login.
//    Change them first if you'd rather use a different email/password.
// 2. Visit this file in your browser.
// 3. Check for the green success message.
// 4. DELETE THIS FILE immediately after — same rule as every other
//    one-time tool in this project.
// =========================================================================

$new_name     = 'Super Admin';
$new_email    = 'admin@bhavyatafoundation.com';
$new_password = 'Bhavyata413@1';
$new_role     = 'superadmin'; // one of: teacher, supervisor, superadmin, parent

// =========================================================================
// Nothing below this needs editing.
// =========================================================================

require_once __DIR__ . '/db_config.php';
header('Content-Type: text/html; charset=utf-8');

function show($ok, $message){
    $color = $ok ? '#1c8a5c' : '#c8433f';
    $bg = $ok ? '#e3f5ec' : '#fbeaea';
    echo "<div style='font-family:Arial; max-width:520px; margin:40px auto; background:$bg; color:$color; padding:20px 26px; border-radius:10px;'>$message</div>";
}

if (!in_array($new_role, ['teacher','supervisor','superadmin','parent'], true)) {
    show(false, "Invalid role '$new_role'. Must be one of: teacher, supervisor, superadmin, parent.");
    exit;
}

$conn = get_db_connection();

$check = $conn->prepare('SELECT id FROM users WHERE email = ?');
$check->bind_param('s', $new_email);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    show(false, "An account with email <b>" . htmlspecialchars($new_email) . "</b> already exists. Nothing was changed.");
    $check->close();
    $conn->close();
    exit;
}
$check->close();

$hash = password_hash($new_password, PASSWORD_BCRYPT);

$stmt = $conn->prepare('INSERT INTO users (name, email, password_hash, role, contact_no, blood_group, leaves_pending, status, created_at) VALUES (?, ?, ?, ?, NULL, NULL, 0, \'active\', NOW())');
$stmt->bind_param('ssss', $new_name, $new_email, $hash, $new_role);

if ($stmt->execute()) {
    show(true, "Account created: <b>" . htmlspecialchars($new_name) . "</b> (" . htmlspecialchars($new_email) . ") as <b>" . htmlspecialchars($new_role) . "</b>.<br>You can now log in with that email and the password you set above.");
} else {
    show(false, "Something went wrong: " . htmlspecialchars($stmt->error));
}

$stmt->close();
$conn->close();
?>
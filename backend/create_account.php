<?php
// =========================================================================
// CREATE ACCOUNT — one-time setup tool for adding real login accounts.
// phpMyAdmin can't compute a proper password hash on its own, so this
// does it the right way (PHP's password_hash, bcrypt) and inserts the row.
//
// HOW TO USE:
// 1. Fill in the 5 values below for the person you're creating.
// 2. Upload this file next to db_test.php, visit it in your browser.
// 3. It'll show the result. Repeat by changing the values for the
//    next person (teacher, supervisor, superadmin, etc.) and reloading.
// 4. DELETE THIS FILE once you're done adding accounts — same rule as
//    db_test.php, it should never stay live on a public server.
//
// ABOUT school_id:
// Your `users` table requires every row to reference a real school in
// the `schools` table (a foreign key). For a teacher or parent account,
// set this to a real school's id (check phpMyAdmin's `schools` table).
// For superadmin or supervisor accounts (not tied to one school), set
// it to null below — but that only works once school_id is made
// nullable in the database. Run this once in phpMyAdmin's SQL tab if
// you haven't already:
//   ALTER TABLE users MODIFY school_id INT NULL;
// =========================================================================

$new_name      = 'Mrs. Sharma';
$new_email     = 'sharma@bhavyata.org';
$new_password  = 'ChangeThisPassword123';
$new_role      = 'teacher'; // one of: teacher, supervisor, superadmin, parent
$new_school_id = 1;         // a real id from your `schools` table, or null


$new_name      = 'Admin User';
$new_email     = 'admin@bhavyata.org';
$new_password  = 'ChangeThisPassword123';
$new_role      = 'superadmin';
$new_school_id = null; // superadmin isn't tied to one school
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

$stmt = $conn->prepare('INSERT INTO users (school_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)');
$stmt->bind_param('issss', $new_school_id, $new_name, $new_email, $hash, $new_role);

if ($stmt->execute()) {
    show(true, "Account created: <b>" . htmlspecialchars($new_name) . "</b> (" . htmlspecialchars($new_email) . ") as <b>" . htmlspecialchars($new_role) . "</b>.<br>They can now log in with that email and the password you set above.");
} else {
    show(false, "Something went wrong: " . htmlspecialchars($stmt->error));
}

$stmt->close();
$conn->close();
?>
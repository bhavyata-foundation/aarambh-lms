<?php
// =========================================================================
// RESET TEACHER PASSWORDS — one-time fix-up tool.
//
// The first bulk run created real teacher accounts, but with hard,
// fully-random passwords nobody wrote down. This resets every existing
// teacher account to the new easier, name-based temporary password
// (e.g. "Reena482@1") — same pattern now used everywhere else.
//
// Run this ONCE. Copy the list shown below immediately — passwords are
// shown only this one time, same rule as create_account.php and the
// bulk creation tool. DELETE THIS FILE once you're done.
// =========================================================================

require_once __DIR__ . '/db_config.php';
header('Content-Type: text/html; charset=utf-8');

function generate_temp_password($fullName){
    $first = preg_split('/\s+/', trim($fullName))[0];
    $first = preg_replace('/[^a-zA-Z]/', '', $first);
    $first = ucfirst(strtolower($first));
    if ($first === '') $first = 'Bhavyata';
    $digits = str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT);
    return $first . $digits . '@1';
}

$conn = get_db_connection();

$teachers = $conn->query("SELECT id, name, email FROM users WHERE role = 'teacher'");

$results = [];

while($row = $teachers->fetch_assoc()){
    $newPassword = generate_temp_password($row['name']);
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    $update = $conn->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $update->bind_param('si', $hash, $row['id']);
    $update->execute();
    $update->close();

    $results[] = [
        'name' => $row['name'],
        'email' => $row['email'],
        'password' => $newPassword
    ];
}

$conn->close();
?>
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Teacher passwords reset</title></head>
<body style="font-family:Arial; max-width:900px; margin:30px auto;">

<div style="background:#fdf2df; color:#b3760b; padding:14px 20px; border-radius:8px; margin-bottom:20px;">
  ⚠ These are the NEW passwords, shown once, right now. Copy this whole
  page or screenshot it before closing. Delete this file from the server
  once you're done.
</div>

<h2><?= count($results) ?> teacher password(s) reset</h2>

<table style="width:100%; border-collapse:collapse; font-size:13px;">
<tr style="background:#eee; text-align:left;">
  <th style="padding:8px;">Teacher</th>
  <th style="padding:8px;">Email</th>
  <th style="padding:8px;">New temp password</th>
</tr>
<?php foreach($results as $r): ?>
<tr style="border-bottom:1px solid #ddd;">
  <td style="padding:8px;"><?= htmlspecialchars($r['name']) ?></td>
  <td style="padding:8px;"><?= htmlspecialchars($r['email']) ?></td>
  <td style="padding:8px; font-family:monospace;"><?= htmlspecialchars($r['password']) ?></td>
</tr>
<?php endforeach; ?>
</table>

<?php if(empty($results)): ?>
<p>No teacher accounts found.</p>
<?php endif; ?>

</body>
</html>
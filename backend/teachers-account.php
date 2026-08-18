<?php
// =========================================================================
// BULK CREATE TEACHER ACCOUNTS — one-time setup tool.
//
// Reads every distinct (school, teacher name) pair already sitting in
// `classes.teacher_name_pending` (from the ward-sheet import) and, for
// each one, creates a real login account and links it to that teacher's
// class row(s) automatically. No manual per-teacher editing needed.
//
// SAFETY NOTES:
// - Matches by (school_id, teacher_name_pending) together, not name
//   alone. This matters because generic placeholder names like
//   "BMC teacher" appear at SEVERAL different schools in the real
//   data — they are almost certainly different real people, and
//   matching by name alone would wrongly link them to one account.
// - Rows flagged with a placeholder-looking name (anything containing
//   "BMC") still get an account created, but are marked with a WARNING
//   below — check these before handing out credentials, since the
//   real person's actual name is still unknown.
// - Already-linked classes (teacher_user_id IS NOT NULL) are skipped,
//   so this is safe to run more than once if it's interrupted partway.
// - Temporary passwords are shown ONCE, in plain text, right here.
//   Copy them out immediately — there's no way to retrieve them again
//   after this page closes. DELETE THIS FILE once you're done, same
//   rule as create_account.php.
// =========================================================================

require_once __DIR__ . '/db_config.php';
header('Content-Type: text/html; charset=utf-8');

$conn = get_db_connection();

function slugify_email($name){
    $clean = preg_replace('/\(.*?\)/', '', $name);        // drop "(BMC teacher)" etc.
    $clean = preg_replace('/[^a-zA-Z\s]/', '', $clean);    // letters and spaces only
    $clean = strtolower(trim($clean));
    $parts = preg_split('/\s+/', $clean);
    return implode('.', array_filter($parts)) . '@bhavyata.org';
}

function random_temp_password($fullName){
    $first = preg_split('/\s+/', trim($fullName))[0];
    $first = preg_replace('/[^a-zA-Z]/', '', $first);
    $first = ucfirst(strtolower($first));
    if ($first === '') $first = 'Bhavyata';
    $digits = str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT);
    return $first . $digits . '@1';
}

// Every (school, teacher) pair still waiting on a real account.
$pending = $conn->query("
    SELECT DISTINCT c.school_id, c.teacher_name_pending, s.name AS school_name
    FROM classes c
    JOIN schools s ON s.id = c.school_id
    WHERE c.teacher_user_id IS NULL
      AND c.teacher_name_pending IS NOT NULL
      AND c.teacher_name_pending != ''
    ORDER BY s.name
");

$results = [];

while($row = $pending->fetch_assoc()){
    $schoolId = $row['school_id'];
    $name = $row['teacher_name_pending'];
    $schoolName = $row['school_name'];
    $isPlaceholder = (stripos($name, 'BMC') !== false);

    // Build a unique email, appending a number if it collides.
    $baseEmail = slugify_email($name);
    $email = $baseEmail;
    $suffix = 1;
    while(true){
        $check = $conn->prepare('SELECT id FROM users WHERE email = ?');
        $check->bind_param('s', $email);
        $check->execute();
        if(!$check->get_result()->fetch_assoc()){ $check->close(); break; }
        $check->close();
        $suffix++;
        $email = str_replace('@bhavyata.org', $suffix . '@bhavyata.org', $baseEmail);
    }

    $tempPassword = random_temp_password($name);
    $hash = password_hash($tempPassword, PASSWORD_BCRYPT);

    $insert = $conn->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $role = 'teacher';
    $insert->bind_param('ssss', $name, $email, $hash, $role);
    $insert->execute();
    $newUserId = $conn->insert_id;
    $insert->close();

    // Link every class row this teacher owns at THIS school — handles
    // the case where one teacher teaches both Jr KG and Sr KG.
    $link = $conn->prepare('UPDATE classes SET teacher_user_id = ? WHERE school_id = ? AND teacher_name_pending = ?');
    $link->bind_param('iis', $newUserId, $schoolId, $name);
    $link->execute();
    $link->close();

    $results[] = [
        'name' => $name,
        'school' => $schoolName,
        'email' => $email,
        'password' => $tempPassword,
        'warning' => $isPlaceholder
    ];
}

$conn->close();
?>
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bulk teacher accounts created</title></head>
<body style="font-family:Arial; max-width:900px; margin:30px auto;">

<div style="background:#fdf2df; color:#b3760b; padding:14px 20px; border-radius:8px; margin-bottom:20px;">
  ⚠ These passwords are shown once, right now. Copy this whole page or
  screenshot it before closing — there is no way to see these again
  afterward. Delete this file from the server once you're done.
</div>

<h2><?= count($results) ?> account(s) created</h2>

<table style="width:100%; border-collapse:collapse; font-size:13px;">
<tr style="background:#eee; text-align:left;">
  <th style="padding:8px;">Teacher</th>
  <th style="padding:8px;">School</th>
  <th style="padding:8px;">Email</th>
  <th style="padding:8px;">Temp password</th>
  <th style="padding:8px;">Note</th>
</tr>
<?php foreach($results as $r): ?>
<tr style="border-bottom:1px solid #ddd;">
  <td style="padding:8px;"><?= htmlspecialchars($r['name']) ?></td>
  <td style="padding:8px;"><?= htmlspecialchars($r['school']) ?></td>
  <td style="padding:8px;"><?= htmlspecialchars($r['email']) ?></td>
  <td style="padding:8px; font-family:monospace;"><?= htmlspecialchars($r['password']) ?></td>
  <td style="padding:8px; color:#c8433f;">
    <?= $r['warning'] ? '⚠ Placeholder name — confirm the real teacher before sharing this login' : '' ?>
  </td>
</tr>
<?php endforeach; ?>
</table>

<?php if(empty($results)): ?>
<p>No pending teachers found — every class already has a linked account, or none had a name filled in yet.</p>
<?php endif; ?>

</body>
</html>
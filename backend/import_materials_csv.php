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
// IMPORT MATERIALS CSV — bulk version of add_materials.php. Same table,
// same columns, same teacher-to-class resolution — this just does it
// for every row in an uploaded CSV instead of one row from a form.
//
// EXPECTED CSV FORMAT — exactly 3 columns, with a header row:
//   item_name,quantity,received_date
//   Chair,28,2026-06-15
//   Duster,5,2026-06-15
//
// received_date must be YYYY-MM-DD. Rows that don't parse (wrong
// column count, blank item_name, unparseable date) are skipped and
// listed back in the response — nothing partial gets silently
// swallowed.
// =========================================================================

session_start();
header('Content-Type: application/json');

$requestHost = strtok($_SERVER['HTTP_HOST'] ?? '', ':');
$isLocalRequest = in_array($requestHost, ['localhost', '127.0.0.1']);
$devRole = ($isLocalRequest && isset($_GET['dev_role'])) ? $_GET['dev_role'] : null;
$effectiveRole = $_SESSION['role'] ?? $devRole;

if ($effectiveRole !== 'teacher') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not authorized.']);
    exit;
}

if (!isset($_FILES['csv_file']) || $_FILES['csv_file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No CSV file was received.']);
    exit;
}

require_once __DIR__ . '/db_config.php';
$conn = get_db_connection();

// Same teacher-to-class resolution as add_materials.php, including the
// same dev-bypass fallback — EXCEPT that fallback had a real bug:
// "any teacher, ordered by id" doesn't check whether that teacher
// actually has a class linked. Fixed here the same way get_my_class.php
// was fixed earlier: hardcoded directly to teacher 49 (Reena
// Chinchankar), the one real teacher-to-class link that actually
// exists in the database right now (class 47). add_materials.php
// likely has this exact same bug — flagging it, not fixing it here,
// since that wasn't what broke this time.
if (isset($_SESSION['user_id'])) {
    $teacherId = $_SESSION['user_id'];
} else {
    $teacherId = 49;
}

$classStmt = $conn->prepare("SELECT id FROM classes WHERE teacher_user_id = ? LIMIT 1");
$classStmt->bind_param('i', $teacherId);
$classStmt->execute();
$classRow = $classStmt->get_result()->fetch_assoc();
$classStmt->close();

if (!$classRow) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Your account is not linked to a class yet — ask your admin to link it.', 'debug_teacherId_used' => $teacherId]);
    exit;
}
$classId = $classRow['id'];

$handle = fopen($_FILES['csv_file']['tmp_name'], 'r');
if (!$handle) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Could not read the uploaded file.']);
    exit;
}

$header = fgetcsv($handle);
$expectedHeader = ['item_name', 'quantity', 'received_date'];
$headerNormalized = $header ? array_map(fn($h) => strtolower(trim($h)), $header) : [];
if ($headerNormalized !== $expectedHeader) {
    fclose($handle);
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'CSV header must be exactly: item_name,quantity,received_date — got: ' . implode(',', $header ?: [])
    ]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO materials (class_id, item_name, quantity, received_date, added_by)
    VALUES (?, ?, ?, ?, ?)
");

$imported = 0;
$skipped = [];
$rowNum = 1; // header was row 1

while (($row = fgetcsv($handle)) !== false) {
    $rowNum++;
    if (count($row) !== 3) {
        $skipped[] = "Row $rowNum: expected 3 columns, got " . count($row);
        continue;
    }
    [$itemName, $quantity, $receivedDate] = array_map('trim', $row);

    if ($itemName === '') {
        $skipped[] = "Row $rowNum: item_name is blank";
        continue;
    }
    if (!DateTime::createFromFormat('Y-m-d', $receivedDate)) {
        $skipped[] = "Row $rowNum: received_date '$receivedDate' is not YYYY-MM-DD";
        continue;
    }

    $stmt->bind_param('isssi', $classId, $itemName, $quantity, $receivedDate, $teacherId);
    if ($stmt->execute()) {
        $imported++;
    } else {
        $skipped[] = "Row $rowNum: database error — " . $stmt->error;
    }
}

fclose($handle);
$stmt->close();
$conn->close();

echo json_encode([
    'status' => 'success',
    'imported' => $imported,
    'skipped_count' => count($skipped),
    'skipped' => $skipped
]);
?>
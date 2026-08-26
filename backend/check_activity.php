<?php
/**
 * check_activity_match.php
 *
 * Stub endpoint for the "does the teacher's actual activity match the
 * suggested activity + domain?" check on Daily Plan / Weekly Activities.
 *
 * DELIBERATELY NOT CONNECTED TO THE DATABASE:
 *   - No db_config.php include.
 *   - No queries against daily_plan_entries or any other table.
 *   - Nothing here is persisted server-side. The browser (teacher.js)
 *     keeps the result in memory for the current tab only.
 *
 * This is a placeholder — it always returns a "pending" verdict. The
 * exact spot to wire in a real agent call is marked below. Swapping it
 * in later is a one-function edit, not a rewrite of this file.
 */

header('Content-Type: application/json');

// Same session-guard convention as the rest of the backend — reuses
// whatever session_check.php already does, without this file needing
// to know the details of how sessions/roles are stored.
require_once __DIR__ . '/session_check.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = [];
}

$domain            = isset($input['domain']) ? trim((string) $input['domain']) : '';
$suggestedActivity = isset($input['suggested_activity']) ? trim((string) $input['suggested_activity']) : '';
$actualActivity    = isset($input['actual_activity']) ? trim((string) $input['actual_activity']) : '';

if ($actualActivity === '') {
    echo json_encode([
        'status' => 'pending',
        'match'  => null,
        'reason' => 'No activity text to check yet.',
    ]);
    exit;
}

/* ============================================================
 * >>> AGENT GOES HERE <<<
 * ------------------------------------------------------------
 * Replace the block below with a real call to your matching agent.
 * Send it $domain, $suggestedActivity, and $actualActivity; it should
 * come back with a yes/no verdict (and ideally a short reason).
 *
 * Once wired, this file's response shape should become:
 *
 *   echo json_encode([
 *       'status' => 'done',
 *       'match'  => $verdict['match'],   // true or false
 *       'reason' => $verdict['reason'],  // short explanation
 *   ]);
 *   exit;
 *
 * Nothing else in this file, or in teacher.js, needs to change for
 * that swap — checkActivityMatch() in teacher.js already reads
 * status/match/reason from whatever this endpoint returns.
 * ============================================================ */

echo json_encode([
    'status' => 'pending',
    'match'  => null,
    'reason' => 'Match-checking agent not wired up yet.',
]);
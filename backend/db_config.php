<?php
// =========================================================================
// SHARED DATABASE CONFIG — every backend script includes this one file,
// so your credentials live in exactly one place instead of being copy-
// pasted into every script separately.
//
// Fill in your real cPanel MySQL details below, then upload this file
// somewhere NOT directly reachable by a browser if possible (e.g. one
// folder above your site's public root). If your hosting only allows
// public_html, that's fine too — just make sure this exact filename
// isn't guessable/linked anywhere public.
// =========================================================================

$db_host = 'localhost';
$db_name = 'aarambh_lms';
$db_user = 'root';
$db_pass = '';

function get_db_connection(){
    global $db_host, $db_name, $db_user, $db_pass;
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name, 3307);
    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
?>
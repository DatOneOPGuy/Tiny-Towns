<?php
session_start();
include 'db_connect.php';


$gameState = $_GET['state'];
$username = $_SESSION['user'];


$stmt = $conn->prepare('SELECT id FROM Users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$user_id = $user['id'];

$score = 0; 


$stmt = $conn->prepare('INSERT INTO Games (user_id, score, board, start_time) VALUES (?, ?, ?, NOW())');
$stmt->bind_param('iis', $user_id, $score, $gameState);
$stmt->execute();

header('Location: /php/info.php');
exit();
?>

<?php
require 'calendar_database.php';
ini_set("session.cookie_httponly", 1);
session_start();

if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

//get form data
$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING);
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$time = filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING);

//see if form data valid
if (!$title || !$date || !$username || !$time) {
    echo "Invalid input data.";
    exit();
}

$stmt = $mysqli->prepare("INSERT INTO events (username, title, event_date, event_time) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $title, $date, $time);

//insert
if ($stmt->execute()) {
    echo "Event added successfully.";
} else {
    echo "Error adding the event.";
}

$stmt->close();
?>

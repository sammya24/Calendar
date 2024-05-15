<?php
require 'calendar_database.php';
ini_set("session.cookie_httponly", 1);
session_start();


if (!hash_equals($_SESSION['token'], $_POST['token'])) {
    die("Request forgery detected");
}

//get data
$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING);
$time = filter_input(INPUT_POST, 'time', FILTER_SANITIZE_STRING);
$event_id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

//see if data valid
if (!$title || !$date ||!$time || !$event_id) {
    echo "Invalid input data.";
    exit();
}

//prep update
$stmt = $mysqli->prepare("UPDATE events SET username = ?, title = ?, event_date = ?, event_time = ? WHERE id = ?");
$stmt->bind_param("ssssi", $_SESSION['username'], $title, $date, $time, $event_id);

//execute update
if ($stmt->execute()) {
    echo json_encode(["message" => "Event updated successfully"]);
} else {
    echo "Error updating the event.";
}

//close connection
$stmt->close();
?>
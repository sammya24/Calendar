<?php
require 'calendar_database.php';

//get id from call
$eventId = $_POST['id'];

$stmt = $mysqli->prepare("SELECT * FROM events WHERE id = ?");
$stmt->bind_param("i", $eventId);
$stmt->execute(); //execute
$result = $stmt->get_result();

$event = $result->fetch_assoc();

echo json_encode($event);

$stmt->close();
exit();
?>
<?php
require 'calendar_database.php';
ini_set("session.cookie_httponly", 1);
session_start();

$id = $_POST['id']; //get id from post

if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

$stmt = $mysqli->prepare("DELETE FROM events WHERE id = ?");
$stmt->bind_param("i", $id);

//execute delete
$stmt->execute();
echo "Successfully deleted.";

$stmt->close();
?>
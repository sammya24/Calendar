<?php

require 'calendar_database.php';
ini_set("session.cookie_httponly", 1);
session_start();

$username = (string) filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = (string) $_POST['password']; //will be hashed- don't need to sanitize

//see if username already exists
$stmt = $mysqli->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    //if username already exists
    $error_message = "Username already exists";
    echo $error_message;
    exit();
}

//hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

//insert new user into table
$stmt = $mysqli->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashed_password);
$stmt->execute();
$stmt->close();

//$success_message = "New user successfully registered!";
echo ("success");
exit();

?>
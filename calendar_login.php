<?php

ini_set("session.cookie_httponly", 1);
session_start();
require('calendar_database.php');

//get post data
$username = (string)$_POST['username'];
$password = (string)$_POST['password'];

//get user info from database
$stmt = $mysqli->prepare("SELECT username, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($username, $pass_hash);
$stmt->fetch();
$stmt->close();

//see if user exists in table
if (isset($username)) {
    if (password_verify($password, $pass_hash)) { //make sure password matches
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); //generate token session var
        $_SESSION['username'] = $username; //set session var to hold logged-in username

        $safeusername = htmlentities($username);
        $data = array("msg" => $responsemsg, "username" => $safeusername, "token" => $_SESSION['token']);
        echo json_encode($data);
        
        exit();
    }
} 

exit();

?>

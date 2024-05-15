<?php
require 'calendar_database.php';
ini_set("session.cookie_httponly", 1);
session_start();

if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

header('Content-Type: application/json'); //set JSON content

if (isset($_POST['date'])) {
    $date = filter_input(INPUT_POST, 'date', FILTER_SANITIZE_STRING);

    if (empty($date)) {
        echo json_encode(array("error" => "Invalid date"));
        exit;
    }
    
    $username = $_SESSION['username'];
    if ($username == null){
        echo json_encode(array("error" => "Not Logged In"));
        exit;   
    }

    //prep to get events
    $stmt = $mysqli->prepare("SELECT title, event_time, id FROM events WHERE event_date = ? AND username = ?");
    $stmt->bind_param("ss", $date, $username);
    $stmt->execute();

    $result = $stmt->get_result();
    $events = array();

    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    //return events JSON foramt
    echo json_encode($events);

    $stmt->close();
} else {
    //if missing or incorrect parameters
    echo json_encode(array("error" => "Invalid parameters"));
}
?>

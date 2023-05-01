<?php

header('Content-Type: application/json');

$aResult = array();
$aResult['saved'] = false;

if (isset($_POST['score']) && isset($_POST['name'])) {
	if (!isset($database)) {
		include 'db_connect.php';
    }
    
    $name = $_POST['name'];
    $score = $_POST['score'];
    
    /* get minimum score in table */
    $sql = "SELECT MIN(`score`) AS `min` FROM `score`";
    $result = $database->query($sql);
    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

    if ($score > $row['min']) { // compare minimum score to submitted score
        $sql = "INSERT INTO `score`(`name`, `score`) VALUES ('$name', '$score')";
        $result = $database->query($sql);
    
        if ($result) {
            $aResult['saved'] = true;
        } else {
            $aResult['error'] = 'insert query error';
        }    
    }
} else {
	$aResult['error'] = 'no value recieved';
}

echo json_encode($aResult);

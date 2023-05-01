<?php

class Database {	
	public function __construct() {
		$this->conn = mysqli_connect("localhost", "root", "", "covid");
		
		if (!$this->conn) {
			die("Connection failed: " . mysqli_connect_error());
		}
	}

	public function __destruct() {
		mysqli_close($this->conn);
	}

	public function query($query) {
		return mysqli_query($this->conn, $query);
	}
}

$database = new Database();

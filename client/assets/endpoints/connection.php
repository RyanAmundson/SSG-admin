<?php
function fConnectToDatabase(){
  $servername = "localhost";
  $username = "generalUser";
  $password = "generaluser";
  #echo "Connecting\n";
//Create connection
  $conn = mysqli_connect("104.236.180.52", "root", "justin555", "SalishSeaDB");
  //$conn = mysqli_connect("127.0.0.1", "root", "boston555", "FI");
//Check connection
  if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
    }
    return $conn;
}
?>

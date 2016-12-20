<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');
// $dbName = $_SERVER["DOCUMENT_ROOT"] . "/SalishSea/pages/design3-7-16/SalishSeaDB.accdb";
// $dbName = "ryanjustin.database.windows.net";
// //echo $dbName;
// if (!file_exists($dbName)) {
//     die("Could not find database file.");
// }
// try{
// $db = new PDO("odbc:DRIVER={Microsoft Access Driver (*.mdb, *.accdb)}; DBQ=".$dbName."; Uid=; Pwd=;");
// }
// catch(PDOException $e){
//     echo $e->getMessage();
//     echo "<br>";
// }
//$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
echo phpinfo();
echo "test";
$conn = OpenConnection();


function OpenConnection()
{
    try
    {
        $serverName = "tcp:ryanjustin.database.windows.net,1433";
        $connectionOptions = array("Database"=>"myDB",
            "Uid"=>"ryanjustin", "PWD"=>"Boston555");
        $conn = sqlsrv_connect($serverName, $connectionOptions);
        if($conn == false)
            die(FormatErrors(sqlsrv_errors()));
    }
    catch(Exception $e)
    {
        echo("Error!");
    }
}


?>

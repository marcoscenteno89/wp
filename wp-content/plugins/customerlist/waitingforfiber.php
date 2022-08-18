<?php
$servername = "localhost";
$username = "northwes_wp";
$password = "lWL!Ad{5";
$dbname = "northwes_Customers";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sqlselect = $conn->prepare("SELECT * FROM cstmwaitingforfiber");
    $sqlselect->execute();
    $kml = array('<?xml version="1.0" encoding="UTF-8"?>');
    $kml[] = '<kml xmlns="http://earth.google.com/kml/2.1">';
    $kml[] = ' <Document>';
    while($row = $sqlselect->fetch()) {
        $address = $row['address'] . ' ' . $row['city'] . ' ' . $row['state'] . ' ' . $row['zip'];
        $kml[] = ' <Placemark id="placemark' . $row['wo'] . '">';
        $kml[] = ' <name>' . htmlentities($row['name']) . '</name>';
        $kml[] = ' <description>' . htmlentities('<strong>Work Order</strong>: '.$row['wo']) . '<br />' . htmlentities('<strong>Address</strong>: '.$address) . '<br />' . htmlentities('<strong>Status</strong>: '.$row['status']) . '<br />' . htmlentities('<strong>Phone</strong>: '.$row['phone']) . '<br />' . htmlentities('<strong>Email</strong>: '.$row['email']) . '</description>';
        $kml[] = ' <Point>';
        $kml[] = ' <coordinates>' . $row['lng'] . ','  . $row['lat'] . '</coordinates>';
        $kml[] = ' </Point>';
        $kml[] = ' </Placemark>';
    } 
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
$conn = null;
$kml[] = ' </Document>';
$kml[] = '</kml>';
$kmlOutput = join("\n", $kml);
header('Content-type: application/vnd.google-earth.kml+xml');
echo $kmlOutput;
?>
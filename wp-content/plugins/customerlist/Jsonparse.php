<?php
header("Access-Control-Allow-Origin: *");
    $servername = "localhost";
    $username = "northwes_wp";
    $password = "lWL!Ad{5";
    $dbname = "northwes_Customers";
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connected successfully lalaland"; 
        $sql = $conn->prepare("SELECT * FROM customers");
        $sql->execute();
        $count = 0;
        while($result = $sql->fetch()) {
            echo $count . ': ' . $result['Name'] . '<br />';
            $count++;
        }
    } catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
        

/*    $conn = mysqli_connect ($servername, $username, $password, $dbname);
    if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
    }
$myjsondata = array();
$customers = mysqli_query($conn, "SELECT * FROM customers WHERE status = 'Pre Install'");
while ($customer = @mysqli_fetch_assoc($customers)){
    //if ($customer['Status'] == 'Pre Install') {
        $row['Name'] = $customer['Name'];
        $row['Address'] = $customer['Address'] . ' ' . $customer['City'] . ' ' . $customer['State'] . ' ' . $customer['Zip'];
        $row['Lat'] = $customer['lat'];
        $row['Lng'] = $customer['lng'];
        array_push($myjsondata,$row);
   //}
}
mysqli_close($conn);
$json = json_encode($myjsondata);
echo $json;*/
$conn = null;
?>
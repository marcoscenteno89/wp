<?php
/*
$servername = "localhost";
$username = "northwes_wp";
$password = "lWL!Ad{5";
$dbname = "northwes_Customers";
$conn = mysqli_connect ($servername, $username, $password, $dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$customers = mysqli_query($conn, "SELECT * FROM cancelled_wo");
while ($customer = @mysqli_fetch_assoc($customers)){
    if ($customer['street'] == '618 s Meridian st' && $customer['name'] == 'James Winkler') {
        $name = $customer['name'];
        $street = $customer['street'];
        $city = $customer['city'];
        
        $sql = "UPDATE cancelled_wo SET date_modified = '{$date}' WHERE name = '{$name}' AND street = '{$street}' AND city = '{$city}'";
        $updatedcus = mysqli_query($conn, "SELECT * FROM cancelled_wo WHERE name = '{$name}' AND street = '{$street}'");
        if (mysqli_query($conn, $sql)) {
            echo $name . " Record updated successfully<br>";
        } else {
            echo " === Error updating record: " . mysqli_error($conn) . "<br>";
        }
    }
}
mysqli_close($conn);
*/
?>
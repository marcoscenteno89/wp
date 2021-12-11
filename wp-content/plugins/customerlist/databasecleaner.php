<?php
$servername = "localhost";
$username = "northwes_wp";
$password = "lWL!Ad{5";
$dbname = "northwes_Customers";
$conn = mysqli_connect ($servername, $username, $password, $dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$customers = mysqli_query($conn, "SELECT * FROM cancelled_wo2");
$count = 0;
while ($customer = @mysqli_fetch_assoc($customers)){
        $sql = "INSERT INTO customersCopy ( Status, Name, Address, City, State, Zip, HomePhone, Email, LastContact, CancelReason, ip, lat, lng ) VALUES 
        ('Lead', '{$customer['name']}', '{$customer['street']}', '{$customer['city']}', '{$customer['state']}', '{$customer['postalcode']}', '{$customer['phone']}', '{$customer['email']}', 
        '{$customer['date_modified']}', '{$customer['cancelled']}', '{$customer['ip']}', '{$customer['lat']}', '{$customer['lng']}')";
        $count++;
        echo $count . ' : ' . $customer['name'] . ' Inserted<br>';
        if (mysqli_query($conn, $sql)) {
            echo " = Record updated successfully<br>";
        } else {
            echo " === Error updating record: " . mysqli_error($conn) . "<br>";
        }
}
mysqli_close($conn);
?>
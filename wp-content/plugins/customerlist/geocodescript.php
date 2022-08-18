<?php
require_once("../../../wp-load.php");
global $wpdb, $table_prefix;
$sql = 'SELECT * FROM '.$table_prefix.'customerlist WHERE City = "Island Park"';
$data = $wpdb->get_results($sql);
$count = 0;
foreach ($data as $customer) {
    if ($count > 1000) {
        echo 'GeoCode Limit Reached';
        wp_die();
    }
    $id = $customer->id;
    $address = $customer->Address . ' ' . $customer->City . ' ' . $customer->State . ' ' . $customer->Zip;
    $string = str_replace (" ", "+", urlencode($address));
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".$string."&sensor=false&key=AIzaSyBN0S0b442L6g6aISyU97o1HT_SC_4NlT0";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = json_decode(curl_exec($ch), true);
    $geometry = $response['results'][0]['geometry'];
    $lat = $geometry['location']['lat'];
    $lng = $geometry['location']['lng'];
    $wpdb->update( $table_prefix.'customerlist', array('lat' => $lat, 'lng' => $lng, ), array('id'=>$id) );
    echo 'lat: '. $lat . ' - ' . 'lng: ' . $lng . '<br>';
    usleep(300);
    $count++;
}
?>
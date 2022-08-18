<?php
    require_once("../../../wp-load.php");

    require_once 'vendor/autoload.php'; 
    
    require('functions.php');

    $infusionsoft = new Infusionsoft\Infusionsoft(array(
        'clientId'     => 'tq2fbqm77drueguazfj8mdju',
        'clientSecret' => 'Yhhcw4tszK',
        'redirectUri'  => plugin_dir_url( __FILE__ ).'infusionsoft.php',
    ));

    global $wpdb, $table_prefix;
    $row = $wpdb->get_results('SELECT value FROM '.$table_prefix.'customer_order_entry_tokens WHERE name = "infusionsoft"');
    $infusionsoft->setToken(unserialize($row[0]->value));

    if (isset($_GET['code']) and !$infusionsoft->getToken()) {
        $infusionsoft->requestAccessToken($_GET['code']);
    }

    $infusionsoft->refreshAccessToken();

    if ($infusionsoft->getToken()) {
        $token = serialize($infusionsoft->getToken());
        $tokensaved = $wpdb->update( $table_prefix.'customer_order_entry_tokens', array( 'name' => 'infusionsoft', 'value' => $token, ), array('id' => 1 ));
		echo $token;
    }
?>
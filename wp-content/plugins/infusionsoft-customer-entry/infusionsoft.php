<?php
    require_once("../../../wp-load.php");
    require_once 'vendor/autoload.php';  
    $infusionsoft = new Infusionsoft\Infusionsoft(array(
        'clientId'     => 'tq2fbqm77drueguazfj8mdju',
        'clientSecret' => 'Yhhcw4tszK',
        'redirectUri'  => plugin_dir_url( __FILE__ ).'infusionsoft.php',
    ));
    global $wpdb, $table_prefix;
    $sql = 'SELECT infusionsoft_value FROM '.$table_prefix.'infusionsoft_customer_entry_tokens WHERE infusionsoft_name = "refresh_token"';
    $sqlrow = $wpdb->get_results($sql);
    $storedvalue = $sqlrow[0]->infusionsoft_value;
    $infusionsoft->setToken(unserialize($storedvalue));
    if (isset($_GET['code']) and !$infusionsoft->getToken()) {
        $infusionsoft->requestAccessToken($_GET['code']);
    }
    $infusionsoft->refreshAccessToken();
    if ($infusionsoft->getToken()) {
        $token = serialize($infusionsoft->getToken());
        $tokensaved = $wpdb->update( $table_prefix.'infusionsoft_customer_entry_tokens', array( 'infusionsoft_name' => 'refresh_token', 'infusionsoft_value' => $token, ), array('id' => 1 ));
		echo $token;
    }
?>
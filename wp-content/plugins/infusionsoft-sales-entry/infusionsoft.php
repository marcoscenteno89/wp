<?php
    error_reporting(~0); 
    ini_set('display_errors', 1);
    require_once("../../../wp-load.php");
    require("../infusionsoft-token-manager/functions.php");
    // require_once 'vendor/autoload.php'; 
    
    // require('functions.php');

    // $infusionsoft = new Infusionsoft\Infusionsoft(array(
    //     'clientId'     => 'tq2fbqm77drueguazfj8mdju',
    //     'clientSecret' => 'Yhhcw4tszK',
    //     'redirectUri'  => plugin_dir_url( __FILE__ ).'infusionsoft.php',
    // ));

    // global $wpdb, $table_prefix;
    // $infusionsoftsql = 'SELECT infusionsoft_value FROM '.$table_prefix.'infusionsoft_sales_entry_tokens WHERE infusionsoft_name = "infusionsoft_token"';
    // $infusionsoftsqlrow = $wpdb->get_results($infusionsoftsql);
    // $infusionsoftstoredvalue = $infusionsoftsqlrow[0]->infusionsoft_value;
    // $infusionsoft->setToken(unserialize($infusionsoftstoredvalue));

    if (isset($_GET['code']) and !$infusionsoft->getToken()) {
        $infusionsoft->requestAccessToken($_GET['code']);
    }

    $infusionsoft->refreshAccessToken();

    if ($infusionsoft->getToken()) {
        $token = serialize($infusionsoft->getToken());
        $tokensaved = $wpdb->update( $table_prefix.'infusionsoft_sales_entry_tokens', array( 
            'infusionsoft_name' => 'infusionsoft_token', 
            'infusionsoft_value' => $token, 
        ), 
        array('id' => 1 ));
		echo $token;
    }
?>
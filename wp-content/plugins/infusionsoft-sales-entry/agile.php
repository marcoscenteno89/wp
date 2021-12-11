<?php
    require_once("../../../wp-load.php");

    require('functions.php');
    
    $api = [];

    global $wpdb, $table_prefix;

    $agilesql = 'SELECT infusionsoft_value FROM '.$table_prefix.'infusionsoft_sales_entry_tokens WHERE infusionsoft_name = "agile_token"';
    $agilesqlrow = $wpdb->get_results($agilesql);
    $agiletoken = json_decode($agilesqlrow[0]->infusionsoft_value);

    $token = upadateagiletoken($agiletoken);
    
    echo $token;
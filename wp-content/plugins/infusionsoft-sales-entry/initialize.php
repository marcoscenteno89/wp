<?php
    if ( !defined( 'ABSPATH' ) ) wp_die();    

    $datetime = new \DateTime('now',new \DateTimeZone('America/Boise'));
    $api = [];
    $data = new stdClass();

    require_once 'vendor/autoload.php';  

    $infusionsoft = new Infusionsoft\Infusionsoft(array(
        'clientId'     => 'tq2fbqm77drueguazfj8mdju',
        'clientSecret' => 'Yhhcw4tszK',
        'redirectUri'  => plugin_dir_url( __FILE__ ).'infusionsoft.php',
    ));

    $text = html_entity_decode($_REQUEST['data']);
    $json = str_replace('\\', '', $text);
    $data = json_decode($json);

    global $wpdb, $table_prefix;
    $infusionsoftsql = 'SELECT infusionsoft_value FROM '.$table_prefix.'infusionsoft_sales_entry_tokens WHERE infusionsoft_name = "infusionsoft_token"';
    $infusionsoftsqlrow = $wpdb->get_results($infusionsoftsql);
    $infusionsoftstoredvalue = $infusionsoftsqlrow[0]->infusionsoft_value;
    $infutoken = unserialize($infusionsoftstoredvalue);
    $infusionsoft->setToken(unserialize($infusionsoftstoredvalue));
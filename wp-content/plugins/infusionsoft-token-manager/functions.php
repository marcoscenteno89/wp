<?php
if ( !defined( 'ABSPATH' ) ) wp_die();
require_once ABSPATH . '/wp-content/plugins/infusionsoft-token-manager/vendor/autoload.php';
$datetime = new \DateTime('now',new \DateTimeZone('America/Boise'));
$inf = "https://api.infusionsoft.com/crm/rest/v1/";
$api = [];
$data = new stdClass();

function getCaptcha() {
    return get_option( 'ab_google_recaptcha_secret' );
}

function apirequest($data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $data['url']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $data['header']);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $data['request']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data['body']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = json_decode(curl_exec($ch), true);
    $response['status_code'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $response;
}
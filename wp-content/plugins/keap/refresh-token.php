<?php
  require_once("../../../wp-load.php");
  require_once 'vendor/autoload.php'; 

  $infusionsoft = new Infusionsoft\Infusionsoft(array(
    'clientId'     => get_option( 'ab_keap_clientid' ),
    'clientSecret' => get_option( 'ab_keap_secretid' ),
    'redirectUri'  => plugin_dir_url( __FILE__ ).'refresh-token.php',
  ));
  
  global $wpdb, $table_prefix;

  require_once('functions.php');
  $token = get_option( 'ab_keap_token' );
  $infusionsoft->setToken(unserialize($token));

  if (isset($_GET['code']) and !$infusionsoft->getToken()) {
    $infusionsoft->requestAccessToken($_GET['code']);
  }

  $infusionsoft->refreshAccessToken();

  if ($infusionsoft->getToken()) {
    $newtoken = serialize($infusionsoft->getToken());
    $updated = update_option( 'ab_keap_token', $newtoken, false );
    echo $updated == 1 ? "<p>Token refreshed Succesfully</p>" : "<p>There was an error</p>";
  }
?>
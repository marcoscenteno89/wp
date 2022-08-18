<?php
  require_once("../../../wp-load.php");
  if (empty(session_id())) session_start();

  require_once 'vendor/autoload.php';  
  $infusionsoft = new Infusionsoft\Infusionsoft(array(
    'clientId'     => get_option( 'ab_keap_clientid' ),
    'clientSecret' => get_option( 'ab_keap_secretid' ),
    'redirectUri'  => plugin_dir_url( __FILE__ ).'new-token.php',
  ));

  if (isset($_SESSION['token'])) {
    $infusionsoft->setToken(unserialize($_SESSION['token']));
  }

  if (isset($_GET['code']) and !$infusionsoft->getToken()) {
    $_SESSION['token'] = serialize($infusionsoft->requestAccessToken($_GET['code']));
  }
  
  if ($infusionsoft->getToken()) {
    $_SESSION['token'] = serialize($infusionsoft->getToken()); 
    $updated = update_option( 'ab_keap_token', $_SESSION['token'], false );
    $output = $updated == 1 ? "True" : "False";
    echo "<p>Token Stored: <strong> $output </strong></p>";
  }  else {
    echo '<a href="' . strval($infusionsoft->getAuthorizationUrl()) . '">Click here to authorize</a>';
  }
?>
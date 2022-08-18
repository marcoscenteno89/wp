<?php
    if(empty(session_id())) session_start();
    require_once 'vendor/autoload.php';  
    $infusionsoft = new Infusionsoft\Infusionsoft(array(
        'clientId'     => 'tq2fbqm77drueguazfj8mdju',
        'clientSecret' => 'Yhhcw4tszK',
        'redirectUri'  => 'http://localhost:100/wp-content/plugins/infusionsoft-sales-entry/newtoken.php',
    ));
    if (isset($_SESSION['token'])) {
        $infusionsoft->setToken(unserialize($_SESSION['token']));
    }
    if (isset($_GET['code']) and !$infusionsoft->getToken()) {
        $_SESSION['token'] = serialize($infusionsoft->requestAccessToken($_GET['code']));
    }
    if ($infusionsoft->getToken()) {
        $infutoken = $infusionsoft->getToken();
        print_r($infutoken);
        echo '<br><br>';
        $_SESSION['token'] = serialize($infusionsoft->getToken()); 
        echo $_SESSION['token'];
    }  else {
        echo '<a href="' . $infusionsoft->getAuthorizationUrl() . '">Click here to authorize</a>';
    }
?>
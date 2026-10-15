<?php
/**
 * Plugin Name: Agile Integration
 * Description: Dynamic web form that interacts with infusionsoft
 * Version: 0.1.0
 * Author: Marcos Centeno
 */
if ( !defined( 'ABSPATH' ) ) wp_die();
function agile_enqueue_scripts() {
  $googleapi = get_option( 'ab_google_api_1' );
  wp_register_style( 
    'agile_css', 
    plugins_url( 'dist/bundle.css' , __FILE__ ), 
    array(), 
    date("m.d.h"), 
    'all' 
  );
	wp_register_script( 
		'agile_js', 
		plugins_url( 'dist/bundle.js', __FILE__ ), 
		array(), 
		date("m.d.h"), 
		true 
	);
  // wp_register_script(
  //   'calendar', 
  //   get_stylesheet_directory_uri( __FILE__ ) . '/js/vanilla-calendar.js', 
  //   array('agile_js'), 
  //   date("m.d.h"), 
  //   true
  // );
  wp_register_script( 
    'agile_googleapi', 
    "https://maps.googleapis.com/maps/api/js?libraries=places&key=$googleapi", 
    array(), 
    array(), 
    true,
  );
  wp_localize_script( 
    'agile_js', 
    'agile_token', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
}

function agile_login( $atts ) {
  wp_enqueue_style( 'agile_css' );
  wp_enqueue_script( 'agile_js' );
  ob_start();
  include 'templates/check-login.html';
  return ob_get_clean(); 
}

function agile_wo( $atts ) {
  wp_enqueue_style( 'agile_css' );
  wp_enqueue_script( 'agile_js' );
  ob_start();
  include 'templates/check-wo.php';
  return ob_get_clean(); 
}

function agile_check_address( $atts ) {
  wp_enqueue_style( 'agile_css' );
  wp_enqueue_script( 'agile_googleapi' );
  wp_enqueue_script( 'agile_js' );
  ob_start();
  include('templates/check-address.php');
  return ob_get_clean(); 
}

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

function agile_token() {
  $token = $_POST['token'];
  $request = '';
  if (isset($token)) {
    if ($token === '') {
      $api['request'] = 'POST';
      $api['url'] = 'https://agileisp.com/api/auth-token/';
      $api['header'] = array('Content-Type: application/json; charset=utf-8');
      $api['body'] = json_encode([
        'username' => get_option( 'ab_agile_username' ),
        'password' => get_option( 'ab_agile_password' ),
      ]);

      $request = apirequest($api);
      $token = $request['token'];
      $email = update_option( 'ab_agile_user_email', $request['email'], false );
      $userId = update_option( 'ab_agile_user_id', $request['id'], false );
    }

    $updated = update_option( 'ab_agile_token', $token, false );
  
    echo json_encode([
      'token' => get_option('ab_agile_token'),
      'email' => get_option('ab_agile_user_email'),
      'id' => get_option('ab_agile_user_id'),
      'updated' => $updated,
    ]);
    wp_die();
  }
  echo json_encode(['token not found']);
  wp_die();
}

add_action( 'wp_ajax_nopriv_agile_token', 'agile_token');
add_action( 'wp_enqueue_scripts', 'agile_enqueue_scripts' );
add_shortcode( 'agile_wo_shortcode', 'agile_wo' );
add_shortcode( 'agile_check_address_shortcode', 'agile_check_address' );
add_shortcode( 'agile_login_shortcode', 'agile_login' );

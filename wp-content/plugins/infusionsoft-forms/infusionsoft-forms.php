<?php
/**
 * Plugin Name: Infusionsoft Forms
 * Description: Dynamic web form that interacts with infusionsoft
 * Version: 0.1.0
 * Author: Marcos Centeno
 */
if ( !defined( 'ABSPATH' ) ) wp_die();

function fi_enqueue_scripts() {
  wp_enqueue_style( 
    'fi_styles', 
    plugins_url( 'css/styles.css' , __FILE__ ), 
    array(), 
    'all' 
  );
	wp_enqueue_script( 
		'fi_forms', 
		plugins_url( 'js/forms.js', __FILE__ ), 
		array(), 
		date("m.d"), 
		true 
	);
  wp_enqueue_script(
    'calendar', 
    get_stylesheet_directory_uri( __FILE__ ) . '/js/vanilla-calendar.js', 
    array('shoppingcart'), 
    date("m.d"), 
    true
  );
  wp_localize_script( 
		'fi_forms', 
		'fi_submit_contact', 
		['ajax_url' => admin_url('admin-ajax.php')]
	);
  wp_localize_script( 
		'fi_forms', 
		'fi_get_contact', 
		['ajax_url' => admin_url('admin-ajax.php')]
	);
  wp_localize_script( 
    'fi_forms', 
    'agile_token', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
}

function cst_field($arr, $content,  $id) {
	if (isset($content)) {
		array_push($arr, [ "content" => $content, "id" => $id ]);
	}
	return $arr;
}

function fi_submit_contact() {
  require ABSPATH . 'wp-content/plugins/infusionsoft-token-manager/functions.php';
	$inf = 'https://api.infusionsoft.com/crm/rest/v1/';
  $tokenObj = unserialize(get_option( 'ab_keap_token' ));
  $token = 'access_token='.$tokenObj->accessToken;
  @extract($_POST);
  $data = str_replace('\\', '', $data);
  $data = json_decode($data);
	$datetime = new DateTime('now', new DateTimeZone('America/Boise'));
  $api['header'] = ['Content-Type: application/json'];
	$body = [];
	$cstF = [];
	$users = [];
	$user = '';
	
	$body["duplicate_option"] = "Email";
	$body["email_addresses"] = [];
	$body['phone_numbers'] = [];
	$body['email_opted_in'] = true;
	$body["opt_in_reason"] = "Service notifications.";

  // LOGIN FOR NOT OVERWRITING CURRENT EXTERNAL OWNER
  if (isset($data->sales_rep)) {
    $empty = [null, '', ' ', 'null'];
    $api['request'] = 'PUT';
    $api['url'] = $inf."contacts/?optional_properties=custom_fields&$token";
    $api['body'] = json_encode([
      "duplicate_option" => "Email",
      "email_addresses" => array(["email" => $data->email, "field" => "EMAIL1"]),
    ]);
    $con = (object) apirequest($api);
    $exOwner = array_filter($con->custom_fields, function($data) {
      return $data['id'] === 80;
    });
    $owner = reset($exOwner)['content'];
    if (!in_array($owner, $empty)) {
      $data->external_owner = $owner;
    }
  }
	
  if (isset($data->given_name)) $body["given_name"] = $data->given_name;
  if (isset($data->family_name)) $body["family_name"] = $data->family_name;
  if (isset($data->phone)) {
		array_push($body['phone_numbers'], [
			"field" => "PHONE1", 
			"number" => $data->phone
		]);
	}
	if (isset($data->email)) {
		array_push($body["email_addresses"], [
			"email" => $data->email, 
			"field" => "EMAIL1"
		]);
    }
	if (isset($data->notification_email)) {
		array_push($body["email_addresses"], [
			"email" => $data->notification_email, 
			"field" => "EMAIL2"
		]);
    }
	if (isset($data->sales_rep)) {
		$api['request'] = 'GET';
		$api['url'] = $inf."users/?$token";
		$api['body'] = '';
		$users = apirequest($api);
		for ($i = 0; $i < count($users['users']); $i++) {
			$temp = (object) $users['users'][$i];
			if (strtolower($data->sales_rep) == strtolower($temp->email_address)) $user = $temp;
		}
		if ($user != '') $body['owner_id'] = $user->id;
	}
	
  //CUSTOM FIELDS
	if (isset($data->product_line)) $cstF = cst_field($cstF, $data->product_line, 20);
	if (isset($data->how_many_devices)) $cstF = cst_field($cstF, $data->how_many_devices, 22);
	if (isset($data->referred_by)) $cstF = cst_field($cstF, $data->referred_by, 106);
	if (isset($data->promo_code)) $cstF = cst_field($cstF, $data->promo_code, 56);
	if (isset($data->comments)) $cstF = cst_field($cstF, $data->comments, 102);
	if (isset($data->account_id)) $cstF = cst_field($cstF, $data->account_id, 160);
	if (isset($data->contact_id)) $cstF = cst_field($cstF, $data->contact_id, 156);

  if (isset($data->workbook_id)) $cstF = cst_field($cstF, $data->workbook_id, 203);
  if (isset($data->fiber_drop_wo)) $cstF = cst_field($cstF, $data->fiber_drop_wo, 199);
  if (isset($data->new_activation_wo)) $cstF = cst_field($cstF, $data->new_activation_wo, 201);
	//OPTIONAL PRODUCT FIELDS
	if (isset($data->internet)) $cstF = cst_field($cstF, $data->internet, 181);
	if (isset($data->voip)) $cstF = cst_field($cstF, $data->voip, 183);
	if (isset($data->security)) $cstF = cst_field($cstF, $data->security, 185);
	if (isset($data->northwest)) $cstF = cst_field($cstF, $data->northwest, 187);
	// LANDLORD FIELDS
	if (isset($data->landlord_name)) $cstF = cst_field($cstF, $data->landlord_name, 172);
	if (isset($data->landlord_phone)) $cstF = cst_field($cstF, $data->landlord_phone, 174);
	if (isset($data->landlord_email)) $cstF = cst_field($cstF, $data->landlord_email, 176);
	// LEGAL FIELDS
	if (isset($data->customer_signature)) $cstF = cst_field($cstF, $data->customer_signature, 140);
	if (isset($data->nid_location)) $cstF = cst_field($cstF, $data->nid_location, 146);
	if (isset($data->terms_conditions)) $cstF = cst_field($cstF, $data->terms_conditions, 138);
	if (isset($data->legal_signature)) $cstF = cst_field($cstF, $data->legal_signature, 142);
	if (isset($data->property_access)) $cstF = cst_field($cstF, $data->property_access, 154);
	if (isset($data->own_location)) $cstF = cst_field($cstF, $data->own_location, 148);
	if (isset($data->sales_rep)) {
    // CONDITIONAL MAKES SURE TO NOT OVERWRITE CURRENT EXTERNAL OWNER IF IT EXISTS
    $cstF = cst_field($cstF, $data->external_owner ? $data->external_owner : $data->sales_rep, 80);
  }
	if (isset($data->installation_notification)) $cstF = cst_field($cstF, $data->installation_notification, 178);
	// UTM FIELDS
	if (isset($data->source_page)) $cstF = cst_field($cstF, $data->source_page, 14);
	if (isset($data->utm_adgroup)) $cstF = cst_field($cstF, $data->utm_adgroup, 4);
	if (isset($data->utm_campaign)) $cstF = cst_field($cstF, $data->utm_campaign, 2);
	if (isset($data->utm_source)) $cstF = cst_field($cstF, $data->utm_source, 6);
	if (isset($data->utm_medium)) $cstF = cst_field($cstF, $data->utm_medium, 8);
	if (isset($data->utm_term)) $cstF = cst_field($cstF, $data->utm_term, 10);
	if (isset($data->utm_content)) $cstF = cst_field($cstF, $data->utm_content, 12);
	
	// END OF CUSTOM FIELDS
  if (sizeof($cstF) > 0) $body['custom_fields'] = $cstF;

  if (isset($data->line1) && isset($data->locality)) {
    if (strlen($data->region) <= 2) {
      $states = array(
        'AL'=>'Alabama',
        'AK'=>'Alaska',
        'AZ'=>'Arizona',
        'AR'=>'Arkansas',
        'CA'=>'California',
        'CO'=>'Colorado',
        'CT'=>'Connecticut',
        'DE'=>'Delaware',
        'DC'=>'District of Columbia',
        'FL'=>'Florida',
        'GA'=>'Georgia',
        'HI'=>'Hawaii',
        'ID'=>'Idaho',
        'IL'=>'Illinois',
        'IN'=>'Indiana',
        'IA'=>'Iowa',
        'KS'=>'Kansas',
        'KY'=>'Kentucky',
        'LA'=>'Louisiana',
        'ME'=>'Maine',
        'MD'=>'Maryland',
        'MA'=>'Massachusetts',
        'MI'=>'Michigan',
        'MN'=>'Minnesota',
        'MS'=>'Mississippi',
        'MO'=>'Missouri',
        'MT'=>'Montana',
        'NE'=>'Nebraska',
        'NV'=>'Nevada',
        'NH'=>'New Hampshire',
        'NJ'=>'New Jersey',
        'NM'=>'New Mexico',
        'NY'=>'New York',
        'NC'=>'North Carolina',
        'ND'=>'North Dakota',
        'OH'=>'Ohio',
        'OK'=>'Oklahoma',
        'OR'=>'Oregon',
        'PA'=>'Pennsylvania',
        'RI'=>'Rhode Island',
        'SC'=>'South Carolina',
        'SD'=>'South Dakota',
        'TN'=>'Tennessee',
        'TX'=>'Texas',
        'UT'=>'Utah',
        'VT'=>'Vermont',
        'VA'=>'Virginia',
        'WA'=>'Washington',
        'WV'=>'West Virginia',
        'WI'=>'Wisconsin',
        'WY'=>'Wyoming',
      );
      $data->region = $states[strtoupper($data->region)];
    }
    $shipping = [
      "country_code" => "USA",
      "field" => "SHIPPING",
      "line1" => $data->line1,
      "locality" => $data->locality,
      "postal_code" => $data->postal_code,
      "region" => $data->region,
    ];
    $billing = $shipping;
    $billing["field"] = "BILLING";
    $body["addresses"] = [$shipping, $billing];
  }
	$api['request'] = 'PUT';
	$api['url'] = $inf."contacts/?$token";
  $api['body'] = json_encode($body);
  $cont = (object) apirequest($api);
	$tag;
  try {
    if (isset($data->tags)) {
      $api['request'] = 'POST';
      $api['url'] = $inf."contacts/$cont->id/tags?$token";
      $api['body'] = '{
        "tagIds": ['.$data->tags.']
      }';
      $tag = apirequest($api);
    }
    
    $or = [];
    if (isset($data->products)) {
      if (count($data->products) > 0) {
        $order['contact_id'] = $cont->id;
        $order['order_date'] = date('Y-m-d\TH:i:s.000\Z');
        $order['order_type'] = 'Offline';
        $order['order_title'] = $data->given_name.' '.$data->family_name;
        $order['order_items'] = [];
        for ($x = 0; $x < count($data->products); $x++) {
          $item = [
            "product_id" => $data->products[$x],
            "quantity" => 1,
          ];
          array_push($order['order_items'], $item);
        }
        $api['request'] = 'POST';
        $api['url'] = $inf."orders/?$token";
        $api['body'] = json_encode($order);
        $or = apirequest($api);
      }
    }
  } catch (\Exception $e) {
    if (function_exists( 'wp_sentry_safe')) {
      wp_sentry_safe(function (\Sentry\State\HubInterface $client) use ($e) {
        $client->withScope(function (\Sentry\State\Scope $scope) use ($client, $e) {
          $scope->setExtra('user_data', $e->getData());
          $client->captureException($e);
        });
      });
    }
  }

  echo json_encode([
		'request' => $data, 
		'contact' => $cont, 
		'order' => $or, 
		'users' => $users, 
		'sales_rep' => $user
	]);
  exit;
}

function fi_get_contact() {
  require ABSPATH . 'wp-content/plugins/infusionsoft-token-manager/functions.php';
	$inf = 'https://api.infusionsoft.com/crm/rest/v1/';
  $tokenObj = unserialize(get_option( 'ab_keap_token' ));
  $token = 'access_token='.$tokenObj->accessToken;
  @extract($_POST);
	$datetime = new DateTime('now', new DateTimeZone('America/Boise'));

  $api['header'] = ['Content-Type: application/json'];
  $api['request'] = 'GET';
  $api['url'] = $inf.'contacts?limit=1&email='.$email.'&'.$token;
  $user = apirequest($api);
  if ($user['count'] > 0) {
    $userid = $user['contacts'][0]['id'];
    $api['url'] = $inf.'contacts/'.$userid.'?optional_properties=custom_fields&'.$token;
    $newuser = apirequest($api);
    echo json_encode($newuser);
    wp_die();
  }
  echo json_encode($user);
  wp_die();
}

function fz_agile_token() {
  $token = $_POST['token'];
  $request = '';
  if (isset($token)) {
    if ($token === '') {
      require ABSPATH . 'wp-content/plugins/infusionsoft-token-manager/functions.php';
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

add_action( 'wp_ajax_nopriv_agile_token', 'fz_agile_token');
add_action( 'wp_ajax_nopriv_fi_get_contact', 'fi_get_contact' );
add_action( 'wp_ajax_nopriv_fi_submit_contact', 'fi_submit_contact' );
add_action( 'wp_ajax_fi_submit_contact', 'fi_submit_contact' );
add_action( 'wp_enqueue_scripts', 'fi_enqueue_scripts' );
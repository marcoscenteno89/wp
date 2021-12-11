<?php
/**
 * Plugin Name: Fiber Zones
 * Description: Landing Page for Customers what to get fiber optics
 * Version: 0.2.0
 * Author: Marcos Centeno
 */
if ( !defined( 'ABSPATH' ) ) wp_die();
function mc_fz_addmenu() {
  add_menu_page('Fiber Zones Dashboard', 'Fiber Zones', 'manage_options', 'Fiber_zones', 'mc_fz_admin', 'dashicons-sos');
}
function fiberzones_options() {
  echo 'hello world';
}
function mc_fz_enqueue_scripts() {
  $googleapi = get_option( 'ab_google_api_1' );
  // ADD YOUR CUSTOM FILES HERE
  wp_register_style( 'mc_fz_admin_css', plugins_url( 'css/mc_fz_admin.css' , __FILE__ ), array(), date("m.d"), 'all');
  wp_register_style( 'styles1', plugins_url( 'css/styles1.css' , __FILE__ ), array('helpercss'), date("m.d"), 'all');
  wp_enqueue_style( 'styles2', plugins_url( 'css/styles2.css' , __FILE__ ), array('helpercss'), date("m.d"), 'all');
  wp_register_script( 'scripts1', plugins_url( 'js/scripts1.js', __FILE__ ), array('helper_js'), date("m.d"), true);
  wp_enqueue_script( 'scripts2', plugins_url( 'js/scripts2.js', __FILE__ ), array('agile'), date("m.d"), true);
  wp_register_script( 'mc_fz_admin_js', plugins_url('js/mc_fz_admin.js' ,  __FILE__ ), array('helper_js'), date("m.d"), true);
  wp_enqueue_script( 
    'googleapi', 
    "https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry&key=$googleapi", 
    array(), 
    array(), 
    true,
  );
  wp_localize_script( 'mc_fz_admin_js', 'admin_ajax_url', ['ajax_url' => admin_url('admin-ajax.php')]);
  wp_localize_script( 'mc_fz_js', 'fz_get_zone', ['ajax_url' => admin_url('admin-ajax.php')]);
  wp_localize_script( 'mc_fz_admin_js', 'fz_get_zone', ['ajax_url' => admin_url('admin-ajax.php')]);
  wp_localize_script( 'mc_fz_admin_js', 'fz_post_zone', ['ajax_url' => admin_url('admin-ajax.php')]);
  wp_localize_script( 'mc_fz_js', 'fz_post_contact', ['ajax_url' => admin_url('admin-ajax.php')]);
}
function mc_fz( $atts ) {
  if (!is_admin()) {
    global $table_prefix, $wpdb;
    $zone = $wpdb->get_row("SELECT * FROM ".$table_prefix."fiberzones_zones WHERE id = ".$atts['id']);
    ob_start();
    include('html/template'.$zone->template.'.php');
    return ob_get_clean(); 
  }
}
function mc_fz_admin() {
  if (is_admin()) {
    wp_enqueue_style( 'mc_fz_admin_css' );
    wp_enqueue_script( 'googleapi' );
    wp_enqueue_script( 'mc_fz_admin_js');
    include('html/admin.php');
  }  
}
function mc_fz_dequeue_files() {
  if ( !is_admin() ) {
    global $post, $wp_scripts, $wp_styles;
    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'mc_fz_shortcode') ) {
      foreach( $wp_styles->queue as $styles ) {
        $style = $wp_styles->registered[$styles];
        if (strpos($style->src, '/wp-content/themes/') == true) wp_dequeue_style($style->handle);
      }
      foreach( $wp_scripts->queue as $scripts ) {
        $script = $wp_scripts->registered[$scripts];
        if (strpos($script->src, '/wp-content/themes/') == true) wp_dequeue_script($script->handle);       
      }
    } 
  }   
}
function fz_template($single_template) {
  if ( !is_admin() ) {
    global $post;
    if (is_a( $post, 'WP_Post' ) && has_shortcode($post->post_content, 'mc_fz_shortcode') ) {
      $single_template = dirname(__FILE__) .'/theme.php';
    }
    return $single_template;
  }
}
function create_plugin_database_tables() {
  global $table_prefix, $wpdb;
  $create_customers = "CREATE TABLE IF NOT EXISTS ".$table_prefix."fiberzones_customers (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `zone` int(11) NOT NULL,
    `first_name` varchar(50) DEFAULT NULL,
    `last_name` varchar(50) DEFAULT NULL,
    `business_name` varchar(50) DEFAULT NULL,
    `email` varchar(50) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `plan` varchar(50) DEFAULT NULL,
    `payment_option` varchar(50) DEFAULT NULL,
    `construction_agreement` varchar(10) DEFAULT 'false',
    `financing_agreement` varchar(10) DEFAULT 'false',
    `easement_agreement` varchar(10) DEFAULT 'false',
    `address` varchar(50) DEFAULT NULL,
    `city` varchar(50) DEFAULT NULL,
    `state` varchar(50) DEFAULT NULL,
    `zip` varchar(50) DEFAULT NULL,
    `location` text,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1";

  $create_zones = "CREATE TABLE IF NOT EXISTS ".$table_prefix."fiberzones_zones (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `template` int(11) NOT NULL,
    `name` varchar(50) DEFAULT NULL,
    `startdate` VARCHAR(50) NULL,
    `enddate` VARCHAR(50) NULL,
    `goal` int(11) DEFAULT NULL,
    `price` int(11) DEFAULT NULL,
    `whale` int(11) DEFAULT NULL,
    `header` text,
    `details` text,
    `smallprint` text,
    `stage` varchar(50) DEFAULT NULL,
    `zoom` int(11) DEFAULT '6',
    `color` varchar(15) DEFAULT '#FF0000',
    `parent` int(11) DEFAULT NULL,
    `center` text,
    `location` text,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1";

  require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
  dbDelta($create_customers);
  dbDelta($create_zones);
}
function mc_fz_post_contact() {
  global $table_prefix, $wpdb;
  require_once ABSPATH . 'wp-content/plugins/infusionsoft-token-manager/functions.php';
  $token = unserialize(gettoken('infusionsoft'));
  $data = json_decode(stripslashes($_REQUEST['data']));
  $args = array(
    'zone' => ((isset($data->zone)) ? $data->zone : '' ),
    'first_name' => sanitize_text_field( (isset($data->first_name)) ? $data->first_name : '' ),
    'last_name' => sanitize_text_field( (isset($data->last_name)) ? $data->last_name : '' ),
    'business_name' => sanitize_text_field( (isset($data->business_name)) ? $data->business_name : '' ),
    'email' => sanitize_email( (isset($data->email)) ? $data->email : '' ),
    'plan' => sanitize_text_field( (isset($data->plan)) ? $data->plan : '' ),
    'payment_option' => sanitize_text_field( (isset($data->payment_option)) ? $data->payment_option : '' ),
    'construction_agreement' => sanitize_text_field((isset($data->construction_agreement)) ? $data->construction_agreement : 'false'),
    'financing_agreement' => sanitize_text_field((isset($data->financing_agreement)) ? $data->financing_agreement : 'false'),
    'easement_agreement' => sanitize_text_field((isset($data->easement_agreement)) ? $data->easement_agreement : 'false'),
    'address' => sanitize_text_field( $data->address ),
    'city' => sanitize_text_field( $data->city ),
    'state' => sanitize_text_field( $data->state_long ),
    'zip' => sanitize_text_field( $data->zip ),
    'location' => json_encode( $data->location ),
  );
    
  if (isset($data->email)) {
    $sub = $wpdb->update($table_prefix.'fiberzones_customers', $args, array('id'=>$data->id));
    $api['request'] = 'PUT';
    $api['url'] = "https://api.infusionsoft.com/crm/rest/v1/contacts/?access_token=".$token->accessToken."&";
    $api['header'] = array('Content-Type: application/json');
    $api['body'] = '{
      "addresses": [
        {
          "country_code": "USA",
          "field": "SHIPPING",
          "line1": "'.$data->address.'",
          "line2": "",
          "locality": "'.$data->city.'",
          "region": "'.$data->state_long.'",
          "postal_code": "'.$data->zip.'"
        },
        {
          "country_code": "USA",
          "field": "BILLING",
          "line1": "'.$data->address.'",
          "line2": "",
          "locality": "'.$data->city.'",
          "region": "'.$data->state_long.'",
          "postal_code": "'.$data->zip.'"
        }
      ],
      "duplicate_option": "Email",
      "email_addresses": [
        {
          "email": "'.$data->email.'",
          "field": "EMAIL1"
        }
      ],
      "family_name": "'.$data->last_name.'",
      "given_name": "'.$data->first_name.'",
      "middle_name": ""
    }';
    $cont = (object) apirequest($api);
    $api['request'] = 'POST';
    $api['url'] = "https://api.infusionsoft.com/crm/rest/v1/contacts/$cont->id/tags?access_token=$token->accessToken&";
    $api['header'] = array('Content-Type: application/json');
    $api['body'] = '{
      "tagIds": ['.$data->tags[0].']
    }';
    $tag = apirequest($api);
    echo $sub == 1 ? json_encode(array('mysql' => $sub, 'infusionsoft' => $cont, 'api' => $api, 'tags' => $tag, 'data' => $data)) : json_encode('error: '.$wpdb->last_error); 
  } else {
    $sub = $wpdb->insert($table_prefix.'fiberzones_customers', $args);
    $args['id'] = $wpdb->insert_id;
    echo $sub == 1 ? json_encode(array('mysql' => $args)) : json_encode('error: '.$wpdb->last_error); 
  }
  wp_die();
}
function fz_post_zone() {
  $data = json_decode(stripslashes($_REQUEST['data']));
  $args = array( 
    'name' => sanitize_text_field($data->name),
    'startdate' => sanitize_text_field($data->startdate),
    'enddate' => sanitize_text_field($data->enddate),
    'goal' => (int)$data->goal,
    'price' => (int) $data->price,
    'whale' => (int) $data->whale,
    'header' => wp_kses($data->header, array('h1' => array(), 'p' => array(), 'hr' => array())),
    'details' => wp_kses($data->details, array('h1' => array(), 'p' => array())),
    'smallprint' => wp_kses($data->smallprint, array('h1' => array(), 'p' => array())),
    'stage' => sanitize_text_field($data->stage),
    'zoom' => (int) $data->zoom,
    'color' => sanitize_text_field($data->color),
    'parent' => (int) $data->parent,
    'center' => sanitize_text_field($data->center),
    'location' => sanitize_text_field($data->location),
  );
  global $table_prefix, $wpdb;
  $dbname = $table_prefix.'fiberzones_zones';
  $data->id == 0 ? $status=$wpdb->insert($dbname, $args) : $wpdb->update($dbname, $args, array('id'=>$data->id));
  echo json_encode($args);
  wp_die();
}
function fz_get_zone() {
  if ( isset($_POST['id']) ) {
    $id = sanitize_text_field( $_POST['id'] );
    global $table_prefix, $wpdb;
    $zones = $wpdb->get_results("SELECT * FROM ".$table_prefix."fiberzones_zones WHERE id = $id")[0];
    $zones->contacts = $wpdb->get_results("SELECT location FROM ".$table_prefix."fiberzones_customers WHERE zone = $id AND email > '' AND location > ''");
    echo json_encode($zones);
  }
  wp_die();
}

add_shortcode( 'mc_fz_shortcode', 'mc_fz' );
add_action( 'wp_print_scripts', 'mc_fz_dequeue_files' );
add_action( 'wp_print_styles', 'mc_fz_dequeue_files' );
add_filter( 'page_template', 'fz_template' );
add_action( 'admin_menu', 'mc_fz_addmenu' );
// add_action( 'admin_enqueue_scripts', 'mc_fz_enqueue_scripts', 50 );
add_action( 'wp_enqueue_scripts', 'mc_fz_enqueue_scripts' );
add_action( 'wp_ajax_nopriv_get_zone', 'fz_get_zone' );
add_action( 'wp_ajax_get_zone', 'fz_get_zone');
add_action( 'wp_ajax_post_zone', 'fz_post_zone');
add_action( 'wp_ajax_nopriv_post_contact', 'mc_fz_post_contact' );
register_activation_hook( __FILE__, 'create_plugin_database_tables' );
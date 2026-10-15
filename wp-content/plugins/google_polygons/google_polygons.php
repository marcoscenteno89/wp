<?php
/**
 * Plugin Name: Google Polygons
 * Description: Create polygons on admin area, have customers check their addresses against poloygons.
 * Version: 0.2.0
 * Author: Marcos Centeno
 */
if ( !defined( 'ABSPATH' ) ) wp_die();

$table = $table_prefix."fiberzones_zones";
global $table_prefix, $wpdb;

class ZoneSetup {

  public $table;

  public function __construct(  ) {

    add_action('init', array( $this, 'custom_post_type'));
    add_action('add_meta_boxes', array($this, 'custom_meta_box'));
    add_action('admin_enqueue_scripts', array($this, 'enqueue'));
    add_action('wp_enqueue_scripts', array($this, 'enqueue'));
    add_filter('plugin_action_links_'.plugin_basename(__FILE__), array($this, 'settings_link'));

  }
  
  function activate() {
    $this->custom_post_type();
    $this->custom_meta_box();
    // $this->gp_enqueue_scripts();
    // $this->create_tables();
    flush_rewrite_rules();
  }

  function deactivate() {
    $this->delete_post_type();
    flush_rewrite_rules();
  }

  function uninstall() {
    $this->delete_tables();
  }

  function create_tables() {
    global $table_prefix, $wpdb;
    $create_customers = "CREATE TABLE IF NOT EXISTS ".$table_prefix."fiberzones_customers (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `zone` int(11) NOT NULL,
      `first_name` varchar(50) DEFAULT NULL,
      `last_name` varchar(50) DEFAULT NULL,
      `email` varchar(50) DEFAULT NULL,
      `phone` varchar(50) DEFAULT NULL,
      `address` varchar(50) DEFAULT NULL,
      `city` varchar(50) DEFAULT NULL,
      `state` varchar(50) DEFAULT NULL,
      `zip` varchar(50) DEFAULT NULL,
      `location` text,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1";
  
    $create_zones = "CREATE TABLE IF NOT EXISTS ".$table_prefix."fiberzones_zones (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `name` varchar(50) DEFAULT NULL,
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

  function delete_tables() {
    global $table_prefix, $wpdb;
    $wpdb->query("DROP TABLE IF EXISTS ".$table_prefix."fiberzones_customers");
    $wpdb->query("DROP TABLE IF EXISTS ".$table_prefix."fiberzones_zones");
  }

  function settings_link($links) {
    array_push($links, '<a href="admin.php?page=google-polygons">Settings</a>');
    array_push($links, '<a href="admin.php?page=google-polygons">Feedback</a>');
    return $links;
  }

  function custom_post_type() {
    register_post_type('zone',
      array(
        'labels' => array(
          'name' => 'Polygon Zones',
          'singular_name' => 'zone'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-sos',
      )
    );
  }

  function custom_meta_box() {
    $arr = array('name', 'zoom', 'color', 'parent', 'center', 'location');
    add_meta_box(
      'zone_details', // ID of the meta box
      'Zone Details', // Title of the meta box
      array($this, 'custom_meta_box_html'), // Callback function
      'zone', // Post type
      'normal', // Context
      'high' // Priority
    );
  }

  function custom_meta_box_html($post) {
    $name = get_post_meta($post->ID, 'name', true);
    $zoom = get_post_meta($post->ID, 'zoom', true);
    $color = get_post_meta($post->ID, 'color', true);
    $parent = get_post_meta($post->ID, 'parent', true);
    $center = get_post_meta($post->ID, 'center', true);
    $location = get_post_meta($post->ID, 'location', true);
    echo "
      <input required type='text' id='' name='' value='$name' class='widefat' placeholder='$name' />
      <input type='text' id='' name='' value='$zoom' class='widefat' placeholder='$zoom' />
      <input type='color' id='' name='' value='$color' />
    ";
  }

  function enqueue() {
    wp_enqueue_script( 'test', plugins_url('/src/index.js'), array(), false );
    // wp_enqueue_style( 'gp_css' );
    // wp_enqueue_script( 'gp_js' );
    // wp_enqueue_script( 'gp_googleapi' );
  }

}

class Zone {
  public $id;
  public $name;
  public $zoom;
  public $color;
  public $parent;
  public $center;
  public $location;
  public $contacts;

  public function __construct( $id, $name, $zoom, $color, $parent, $center, $location ) {
    $this->id = $id;
    $this->name = sanitize_text_field($name);
    $this->zoom = (int) $zoom;
    $this->color = sanitize_text_field($color);
    $this->parent = (int) $parent;
    $this->center = sanitize_text_field($center);
    $this->location = sanitize_text_field($location);
  }

  public function get() {
    return $this;
  }

  public function create() {
    return $wpdb->insert($table, $this);
  }

  public function update() {
    return $wpdb->update($table, $this, array('id'=>$this->id));
  }

  public function delete() {
    return $wpdb->delete($table, array('id'=>$this->id));
  }

}





function gp_custom_properties_callback($post) {
  // Use nonce for verification
  wp_nonce_field('gp_custom_properties_nonce_action', 'gp_custom_properties_nonce');

  // Custom property fields
  $name = get_post_meta($post->ID, 'name', true);
  $zoom = get_post_meta($post->ID, 'zoom', true);
  $color = get_post_meta($post->ID, 'color', true);
  $parent = get_post_meta($post->ID, 'parent', true);
  $center = get_post_meta($post->ID, 'center', true);
  $location = get_post_meta($post->ID, 'location', true);

  // Meta box HTML
  echo '<label for="gp_custom_property">' . __('Custom Property', 'textdomain') . '</label>';
  echo '<input type="text" id="gp_custom_property" name="gp_custom_property" value="' . esc_attr($custom_property) . '" class="widefat" />';
}

function gp_test() {
  $zone = new Zone(0, 'Test', 6, '#FF0000', 0, '0,0', '0,0');
  $zone->create();
  echo json_encode(['zone' => $zone->get()]);
}

function gp_addmenu() {
  add_menu_page(
    'Google Polygons Dashboard', 
    'Google Polygons', 
    'manage_options', 
    'google-polygons', 
    'gp_admin', 
    'dashicons-sos'
  );
}

function gp_enqueue_scripts() {
  // $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

  // wp_enqueue_script(
  //     'example-editor-scripts',
  //     plugins_url( 'build/index.js', __FILE__ ),
  //     $asset_file['dependencies'],
  //     $asset_file['version']
  // );


  $googleapi = get_option( 'ab_google_api_1' );
  // ADD YOUR CUSTOM FILES HERE
  wp_register_style( 
    'gp_admin_css', 
    plugins_url( 'css/admin.css' , __FILE__ ), 
    array(), 
    date("m.d"), 
    'all'
  );
  wp_register_style( 
    'gp_css', 
    plugins_url( 'css/css.css' , __FILE__ ), 
    array(), 
    date("m.d"), 
    'all'
  );
  wp_register_script( 
    'gp_js', 
    plugins_url( 'js/js.js', __FILE__ ), 
    array(), 
    date("m.d"), 
    true
  );
  wp_register_script( 
    'gp_admin_js', 
    plugins_url('js/admin.js' ,  __FILE__ ), 
    array('helper'), 
    date("m.d"), 
    true
  );
  wp_register_script( 
    'gp_googleapi', 
    "https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry,places&key=$googleapi&callback=initMap", 
    array(), 
    array(), 
    true,
  );
  wp_localize_script( 
    'gp_admin_js', 
    'admin_ajax_url', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
  wp_localize_script( 
    'gp_js', 
    'gp_get_zone', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
  wp_localize_script( 
    'gp_admin_js', 
    'gp_get_zone', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
  wp_localize_script( 
    'gp_admin_js', 
    'gp_post_zone', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
  wp_localize_script( 
    'gp_js', 
    'gp_post_contact', 
    ['ajax_url' => admin_url('admin-ajax.php')]
  );
}

function gp( $atts ) {
  if (!is_admin()) {
    wp_enqueue_style( 'gp_css' );
    wp_enqueue_script( 'gp_js' );
    wp_enqueue_script( 'gp_googleapi' );
    ob_start();
    include('html/template.php');
    return ob_get_clean(); 
  }
}

function gp_admin() {
  if (is_admin()) {
    wp_enqueue_style( 'gp_admin_css' );
    wp_enqueue_script( 'gp_googleapi' );
    wp_enqueue_script( 'gp_admin_js');
    include('html/admin.php');
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
    `email` varchar(50) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `address` varchar(50) DEFAULT NULL,
    `city` varchar(50) DEFAULT NULL,
    `state` varchar(50) DEFAULT NULL,
    `zip` varchar(50) DEFAULT NULL,
    `location` text,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1";

  $create_zones = "CREATE TABLE IF NOT EXISTS ".$table_prefix."fiberzones_zones (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) DEFAULT NULL,
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

function gp_post_contact() {
  global $table_prefix, $wpdb;
  $data = json_decode(stripslashes($_REQUEST['data']));
  $args = array(
    'zone' => ((isset($data->zone)) ? $data->zone : '' ),
    'first_name' => sanitize_text_field( (isset($data->first_name)) ? $data->first_name : '' ),
    'last_name' => sanitize_text_field( (isset($data->last_name)) ? $data->last_name : '' ),
    'email' => sanitize_email( (isset($data->email)) ? $data->email : '' ),
    'phone' => sanitize_text_field( (isset($data->phone)) ? $data->phone : '' ),
    'address' => sanitize_text_field( $data->address ),
    'city' => sanitize_text_field( $data->city ),
    'state' => sanitize_text_field( $data->state_long ),
    'zip' => sanitize_text_field( $data->zip ),
    'location' => json_encode( $data->location ),
  );
    
  if (isset($data->email)) {
    $sub = $wpdb->update($table_prefix.'fiberzones_customers', $args, array('id'=>$data->id));
  } else {
    $sub = $wpdb->insert($table_prefix.'fiberzones_customers', $args);
    $args['id'] = $wpdb->insert_id;
  }
  echo json_encode($sub == 1 ? array('mysql' => $args, 'data' => $data) : array('error' => $wpdb->last_error) ); 
  wp_die();
}

function gp_post_zone() {
  $data = json_decode(stripslashes($_REQUEST['data']));
  $args = array( 
    'name' => sanitize_text_field($data->name),
    'zoom' => (int) $data->zoom,
    'color' => sanitize_text_field($data->color),
    'parent' => (int) $data->parent,
    'center' => sanitize_text_field($data->center),
    'location' => sanitize_text_field($data->location),
  );
  global $table_prefix, $wpdb;
  $dbname = $table_prefix.'fiberzones_zones';
  $data->id == 0 ? $status=$wpdb->insert($dbname, $args) : $wpdb->update($dbname, $args, array('id'=>$data->id));
  
  wp_die();
}

function gp_get_zone() {
  if ( isset($_POST['id']) ) {
    $id = sanitize_text_field( $_POST['id'] );
    global $table_prefix, $wpdb;
    $zones = $wpdb->get_results("SELECT * FROM ".$table_prefix."fiberzones_zones WHERE id = $id")[0];
    $zones->contacts = $wpdb->get_results("SELECT location FROM ".$table_prefix."fiberzones_customers WHERE zone = $id");
    echo json_encode($zones);
  }
  wp_die();
}

// add_shortcode( 'gp_shortcode', 'gp' );
// add_action( 'admin_menu', 'gp_addmenu' );
// add_action( 'admin_enqueue_scripts', 'gp_enqueue_scripts', 50 );
// add_action( 'wp_enqueue_scripts', 'gp_enqueue_scripts' );
// add_action( 'wp_ajax_nopriv_get_zone', 'gp_get_zone' );
// add_action( 'wp_ajax_get_zone', 'gp_get_zone');
// add_action( 'wp_ajax_post_zone', 'gp_post_zone');
// add_action( 'wp_ajax_nopriv_post_contact', 'gp_post_contact' );
// register_activation_hook( __FILE__, 'create_plugin_database_tables' );


if ( class_exists('ZoneSetup') ) {
  $zone = new ZoneSetup();
}

register_activation_hook(__FILE__, array($zone, 'activate'));
register_deactivation_hook(__FILE__, array($zone, 'deactivate'));
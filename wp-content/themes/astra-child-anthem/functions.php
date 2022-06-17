<?php

// Marketably Astra Staging Theme functions and definitions
// @link https://developer.wordpress.org/themes/basics/theme-functions/
// @package Marketably Astra Staging
// @since 1.0.0

// Define Constants
define( 'CHILD_THEME_MARKETABLY_ASTRA_STAGING_VERSION', '1.0.0' );

// Enqueue styles
function child_enqueue_styles() {
 
  wp_enqueue_style( 
    'helpercss', get_stylesheet_directory_uri() . '/css/helper.css', 
    array(), 
    date("m.d"), 
    'all' 
  );
  wp_enqueue_style( 
    'marketably-astra-staging-theme-css', get_stylesheet_directory_uri() . '/style.css', 
    array('astra-theme-css'), 
    CHILD_THEME_MARKETABLY_ASTRA_STAGING_VERSION, 
    'all' 
  );
  wp_enqueue_style( 
    'fontawesome', 
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css', 
    array(),  
    'all'
  );
  wp_enqueue_style( 
    'bootstrapcss', 
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css', 
    array(), 
    'all'
  );
  wp_enqueue_script( 
    'bootstrapjs', 
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', 
    array('jquery'), 
    ''
  );
  wp_enqueue_script( 
    'popperjs', 
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', 
    array('jquery'), 
    ''
  );
}

function year_shortcode() {
  return date('Y');
}

function create_post_type() {
  // Add categories and tags to page
  register_taxonomy_for_object_type('post_tag', 'page'); 
  register_taxonomy_for_object_type('category', 'page'); 
}

function checkForEI() {
  if (strpos($_SERVER['HTTP_USER_AGENT'], 'rv:11.0') !== false && strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0;') !== false) {
    return '<div class="alert alert-danger" style="margin:1rem;"role="alert">
      <p>It looks like you are using Internet Explorer which may cause issues with this site. We would recommend using one of the following browsers: </p>
      <ul>
        <li><a href="https://www.google.com/chrome/" target="_blank" class="btn btn-secondary">Chrome</a></li>
        <li>Safari</li>
        <li>Microsoft Edge</li>
        <li><a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" class="btn btn-secondary">Firefox</a></li>
      </ul>
    </div>';
  }
}
add_action( 'init', 'create_post_type' );
add_shortcode('year', 'year_shortcode');
add_shortcode('checkei', 'checkForEI');
add_action( 'wp_enqueue_scripts', 'child_enqueue_styles');
remove_action( 'admin_notices', 'woothemes_updater_notice' );
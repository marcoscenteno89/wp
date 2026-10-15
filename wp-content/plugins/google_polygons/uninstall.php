<?php
if (!defined('WP_UNINSTALL_PLUGIN')) exit;

// Check if the current user actually has the capability to delete plugins
if (!current_user_can('delete_plugins')) return;

// Delete the plugin post type and all associated posts
// $zones = get_post( array('post_type' => 'zones', 'numberposts' => -1));
// foreach ($zones as $zone) wp_delete_post($zone->ID, true);

// $zone_contacts = get_post( array('post_type' => 'zone_contacts', 'numberposts' => -1));
// foreach ($zone_contacts as $contact) wp_delete_post($contact->ID, true);

global $wpdb;
$wpdb->query("DROP FROM wp_posts WHERE post_type = 'zones'");
$wpdb->query("DROP FROM wp_posts WHERE post_type = 'zone_contacts'");
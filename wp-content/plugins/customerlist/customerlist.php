<?php
/**
 * Plugin Name: Customer List
 * Description: A map that displays current customers and leads
 * Version: 0.1.0
 * Author: Marcos Centeno
 */

function mc_cl_addmenu() {
    add_menu_page('Customer Map', 'Customer List', 'read', 'customer_list', 'mc_cl_admin', 'dashicons-universal-access' );
}
function mc_cl_enqueue_scripts() {
    wp_register_style('mc_cl_css', plugins_url( '/css/mc_cl_admin.css' , __FILE__ ));
    wp_register_script('mc_cl_js', plugins_url( '/js/mc_cl_admin.js' , __FILE__ ));
    wp_register_script('mc_markercluster', plugins_url( '/js/mc_markerclusterer.js' , __FILE__ ));
    wp_register_script('mc_googleapi', 'https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry&key=AIzaSyABF80pQepngcW0rojqPcKQGwKRcqiPhu4&callback=initMap', array('mc_markercluster'), '', true );
    wp_localize_script( 'mc_cl_js', 'sqlrequest_ajax', array( 'ajax_url' => admin_url('admin-ajax.php')) );
}

function sqlrequest() {
    if ( isset($_POST['sqlstmt']) ) {
        $sqlrequest = $_POST['sqlstmt'];
        $whereclause = array();
        if ( $sqlrequest['customers_active'] == 'true' ) {
            array_push($whereclause, '(Status IN ("Active", "Hibernating", "Delinquent"))');
        }
        if ( $sqlrequest['customers_nonactive'] == 'true' ) {
            array_push($whereclause, 'Status = "Not Active" OR Status = "Unistall" OR Status = "Collections"');
        } 
        if ( $sqlrequest['leads_leads'] == 'true' ) {
            array_push($whereclause, 'CancelReason = "" AND (Status = "Pre Install" OR Status = "Lead")');
        } 
        if ( $sqlrequest['leads_wonoshot'] == 'true' ) {
            array_push($whereclause, 'CancelReason = "No Line of Sight"');
        } 
        if ( $sqlrequest['leads_wocancelled'] == 'true' ) {
            array_push($whereclause, '(CancelReason = "Cancelled" AND Status NOT IN ("Active", "Hibernating", "Delinquent"))');
        } 
        if ( $sqlrequest['leads_womaxap'] == 'true' ) {
            array_push($whereclause, '(CancelReason = "Maxed AP" AND Status NOT IN ("Active", "Hibernating", "Delinquent"))');
        } 
        if ( $sqlrequest['leads_wolosttocompetitor'] == 'true' ) {
            array_push($whereclause, '(CancelReason = "Lost to Competitor" AND Status NOT IN ("Active", "Hibernating", "Delinquent"))');
        } 
        if  ( $sqlrequest['all'] == 'true' ) {
            array_push($whereclause, 'ID != ""');
        }
        $key = $sqlrequest['keyword'];
        if  ( $key !== 'false' ) {
            $sqlkeyword = "id LIKE '%$key%' OR Status LIKE '%$key%' OR CancelReason LIKE '%$key%' OR FirstName LIKE '%$key%' OR LastName LIKE '%$key%' OR CompanyName LIKE '%$key%' OR 
            Phone LIKE '%$key%' OR Email LIKE '%$key%' OR Address LIKE '%$key%' OR City LIKE '%$key%' OR State LIKE '%$key%' OR Zip LIKE '%$key%'";
            array_push($whereclause, $sqlkeyword);
        }
        $whereclause = join(' OR ', $whereclause);
        global $wpdb, $table_prefix;
        $state = 'AND (State = "ID" OR State = "MT" OR State = "OR" OR State = "WY")';
        $customerresults = $wpdb->get_results( "SELECT * FROM ".$table_prefix."customerlist WHERE ($whereclause) $state" );
        foreach ( $customerresults as $customerresult ) {
            $customer[] = array(
                'lat' => floatval($customerresult->lat), 
                'lng' => floatval($customerresult->lng), 
                'CancelReason' => $customerresult->CancelReason, 
                'Status' => $customerresult->Status, 
                'Name' => $customerresult->CompanyName,
                'Address' => $customerresult->Address.' '.$customerresult->City.' '.$customerresult->State.' '.$customerresult->Zip
            );
        }
        echo json_encode($customer); 
    }
    wp_die();
}

function mc_cl_admin() {
    wp_enqueue_style( 'mc_cl_css' );
    wp_enqueue_script( 'mc_cl_js' );
    wp_enqueue_script( 'mc_markercluster' );
    wp_enqueue_script( 'mc_googleapi' );
    include( 'mc_cl_admin_html.php' );
}

add_action( 'wp_ajax_sqlrequest', 'sqlrequest' );
add_action( 'admin_enqueue_scripts', 'mc_cl_enqueue_scripts' );
add_action('admin_menu', 'mc_cl_addmenu');
?>
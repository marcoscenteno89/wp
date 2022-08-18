<?php
/**
 * Plugin Name: Infusionsoft Customer Entry
 * Description: [shortcode_infusionsoft_customer_entry]
 * Version: 0.1.0
 * Author: Marcos Centeno
 */
if ( ! defined( 'ABSPATH' ) ) {     wp_die();    }
function infusionsoft_customer_entry_enqueue_myscripts() {
    wp_register_style( 'infusionsoft_customer_entry_css', plugins_url( 'infusionsoft-customer-entry.css' , __FILE__ ), array(), 'all', false );
    wp_register_script( 'infusionsoft_customer_entry_js', plugins_url( 'infusionsoft-customer-entry.js' , __FILE__ ), array() );
    wp_localize_script( 'infusionsoft_customer_entry_js', 'infusionsoft_customer_entry_api_ajax', array( 'ajax_url' => admin_url('admin-ajax.php')) );
}
add_action( 'wp_enqueue_scripts', 'infusionsoft_customer_entry_enqueue_myscripts' );
add_action( 'admin_enqueue_scripts', 'infusionsoft_customer_entry_enqueue_myscripts' );
function infusionsoft_customer_entry_api() {
    require_once 'vendor/autoload.php';  
    $infusionsoft = new Infusionsoft\Infusionsoft(array(
        'clientId'     => 'tq2fbqm77drueguazfj8mdju',
        'clientSecret' => 'Yhhcw4tszK',
        'redirectUri'  => plugin_dir_url( __FILE__ ).'infusionsoft.php',
    ));
    $infusionsoft->setDebug(true);
    global $wpdb, $table_prefix;
    $sql = 'SELECT infusionsoft_value FROM '.$table_prefix.'infusionsoft_customer_entry_tokens WHERE infusionsoft_name = "refresh_token"';
    $sqlrow = $wpdb->get_results($sql);
    $storedvalue = $sqlrow[0]->infusionsoft_value;
    $infutoken = unserialize($storedvalue);
    $infusionsoft->setToken(unserialize($storedvalue));
    $text = html_entity_decode($_REQUEST['data']);
    $json = str_replace('\\', '', $text);
    $json = json_decode($json);
    $products = $json->products;
    $productlist = [];
    if ($json->productsonly == true) {
        for ($x = 0; $x < count($products); $x++) {   
            $item = $infusionsoft->products()->find($products[$x]);
            array_push($productlist, $item);
        }
        echo json_encode($productlist);
        wp_die();
    } else {
        $customer = $json->customer;
        $api = [];
        $datetime = new \DateTime('now',new \DateTimeZone('America/Boise'));
        $contact = $infusionsoft->contacts()->create([
            "duplicate_option" => "Email",
            "given_name" => $customer->fname,
            "family_name" => $customer->lname,
            "owner_id" => 5,
            "email_addresses" => array(
                array(
                    "email" => $customer->email,
                    "field" => "EMAIL1"
                )
            ),
            "custom_fields" => array(
                array(
                    "id" => 5,
                    "content" => "residential"
                )
            ),
            "lead_source_id" => 744,
            "addresses" => array(
                array(
                    "field" => "BILLING",
                    "line1" => $customer->billingaddress1,
                    "line2" => $customer->billingaddress2,
                    "locality" => $customer->billingcity,
                    "postal_code" => $customer->billingzip,
                    "region" => $customer->billingstate,
                    "country_code" => "USA"
                ),
                array(
                    "field" => "SHIPPING",
                    "line1" => $customer->shippingaddress1,
                    "line2" => $customer->shippingaddress2,
                    "locality" => $customer->shippingcity,
                    "postal_code" => $customer->shippingzip,
                    "region" => $customer->shippingstate,
                    "country_code" => "USA"
                )  
            ),
            "phone_numbers" => array(
                array(
                    "field" => "PHONE1",
                    "number" => $customer->phone
                )
            )
        ],true); 
        $contacts = $infusionsoft->contacts();
        $contacts->id = $contact->id;
        $tags = $contacts->addTags([273]); // APPLY TAGS
        $opportunity = $infusionsoft->opportunities()->create([
            "opportunity_notes" => $customer->notes,
            "opportunity_title" => "$contact->given_name $contact->family_name",
            "contact" => array(
                "id" => $contact->id,
                "email" => $contact->email_addresses->email,
                "first_name" => $contact->given_name,
                "last_name" => $contact->family_name
            ), 
            "user" => array(
                "id" => 5
            ),         
            "stage" => array(
                "id" => 5
            )  
        ]);
        $api['request'] = 'PATCH'; 
        $api['token'] = 'access_token='.$infutoken->accessToken.'&';
        $api['url'] = 'https://api.infusionsoft.com/crm/rest/v1/opportunities/'.$opportunity->id.'?'.$api['token'];
        $api['bodycontent'] = '{
            "user": {
                "id": 5
            }
        }';
        $opportunityupdated = customerapirequest($api);
        $invoice = $infusionsoft->invoices()->createBlankOrder($contact->id, $contact->given_name.' '.$contact->family_name, $datetime, 0, 0);
        for ($x = 0; $x < count($products); $x++) {   
            $item = $infusionsoft->products()->find($products[$x]);
            $invoiceitems = $infusionsoft->invoices()->addOrderItem( $invoice, $item->id, 4, $item->product_price, 1, 'order item', '');
            array_push($productlist, $item);
        }
        $amount = $infusionsoft->invoices()->calculateAmountOwed($invoice);
        $payment = $infusionsoft->invoices()->addManualPayment($invoice, $amount, $datetime, 'Check', 'Offline Payment', false);
        echo json_encode($contact);
        wp_die();
    }   
}
add_action( 'wp_ajax_nopriv_infusionsoft_customer_entry_api', 'infusionsoft_customer_entry_api' );
add_action('wp_ajax_infusionsoft_customer_entry_api', 'infusionsoft_customer_entry_api');
function infusionsoft_customer_entry() {
    wp_enqueue_style( 'infusionsoft_customer_entry_css' );
    wp_enqueue_script( 'infusionsoft_customer_entry_js' );
    ob_start();
    include('infusionsoft-customer-entry-html.php');
    return ob_get_clean();   
}
add_shortcode( 'shortcode_infusionsoft_customer_entry', 'infusionsoft_customer_entry' );

function infusionsoft_customer_entry_create_table() {
    global $table_prefix, $wpdb;
    $create_customers = 'CREATE TABLE IF NOT EXISTS '.$table_prefix.'infusionsoft_customer_entry_tokens (
        id INT NOT NULL AUTO_INCREMENT,
        infusionsoft_name VARCHAR(50),
        infusionsoft_value VARCHAR(1000),
        Infusionsoft_status VARCHAR(50),
        PRIMARY KEY (id))';
    require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
    dbDelta($create_customers);
}
register_activation_hook( __FILE__, 'infusionsoft_customer_entry_create_table' );
function customerapirequest($data) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $data['url']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $data['request']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data['bodycontent']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $response;
}
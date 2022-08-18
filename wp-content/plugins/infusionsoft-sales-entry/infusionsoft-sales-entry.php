<?php
/**
 * Plugin Name: Infusionsoft Sales Entry
 * Description: [shortcode_infusionsoft_sales_entry]
 * Version: 0.1.0
 * Author: Marcos Centeno
 */
if ( ! defined( 'ABSPATH' ) ) {     wp_die();    }
function infusionsoft_sales_entry_enqueue_myscripts() {
    wp_register_style( 'infusionsoft_sales_entry_css', plugins_url( 'css/infusionsoft-sales-entry.css' , __FILE__ ), array(), 'all', false );
    wp_register_script( 'infusionsoft_sales_entry_js', plugins_url( 'js/infusionsoft-sales-entry.js' , __FILE__ ), array('jquery') );
    wp_register_script( 'jirajs', 'https://jira.safelink.net/s/4ef96e6be3a3a624b8f89c22d0e2ae3e-T/43ep86/801000/21a93caaba2f6dec29ba0b5447917277/3.0.7/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=0487723b', null );
    wp_register_script('mc_googleapi', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBN0S0b442L6g6aISyU97o1HT_SC_4NlT0&libraries=drawing,geometry', array(), false );
    wp_localize_script( 'infusionsoft_sales_entry_js', 'infusionsoft_sales_entry_api_ajax', array( 'ajax_url' => admin_url('admin-ajax.php')) );
}

function infusionsoft_sales_entry_api() {

    require('initialize.php');
    require('functions.php');
    if (isset($data->verifyuser)) {
        $x = [];
        $x['status_code'] = 200;
        if (empty($infusionsoft->data()->findByField('User', 1, 0, 'Email', $data->verifyuser, array('id', 'Email')))) {
            $x['valid_user'] = false;
        } else{
            $x['valid_user'] = true;
        }
        echo json_encode($x);
        wp_die();
    }
    if (isset($data->populate)) {

        $api['request'] = 'GET';
        $api['header'] = array('Content-Type: application/json');
        $api['token'] = 'access_token='.$infutoken->accessToken.'&';
        $api['url'] = 'https://api.infusionsoft.com/crm/rest/v1/contacts?limit=1&email='.$data->populate.'&'.$api['token'];
        $user = apirequest($api);
        if ($user['count'] > 0) {
            $userid = $user['contacts'][0]['id'];
            $api['url'] = 'https://api.infusionsoft.com/crm/rest/v1/contacts/'.$userid.'?optional_properties=custom_fields&'.$api['token'];
            $user = apirequest($api);
            if (isset($user['owner_id'])) {
                $contact['owner'] = $infusionsoft->data()->findByField('User', 1, 0, 'Id', $user['owner_id'], array('id', 'Email'));
            }
            $contact['address'] = $user['addresses'][0];
            $contact['phone'] = $user['phone_numbers'][0]['number'];
            $contact['fname'] = $user['given_name'];
            $contact['lname'] = $user['family_name'];
            
            $custf = [];
            foreach ($user['custom_fields'] as $row) {
                switch ($row['content']) {
                    case '':
                        break;
                    case null:
                        break;
                    case 'null':
                        break;
                    default:
                    array_push($custf, $row);
                }
            }

            $contact['custom_fields'] = $custf;
            $contact['status_code'] = $user['status_code'];
            $contact['count'] = 1;

            echo json_encode($contact);
            wp_die();
        }
        echo json_encode($user);
        wp_die();
    }

    if ($data->customer->salesrep != '') {
        $data->customer->owner = $infusionsoft->data()->findByField('User', 1, 0, 'Email', $data->customer->salesrep, array('id', 'Email'));
        if (empty($data->customer->owner)) {
            $data->customer->owner = $infusionsoft->data()->findByField('User', 1, 0, 'Email', 'davidc@dynamitewireless.com', array('id', 'Email'));
        } 
        $data->customer->owner = (object) $data->customer->owner[0];
    } 
    
    if ($data->customer->email != '') {
        $contact = $infusionsoft->contacts()->create([
            "duplicate_option" => "Email",
            "given_name" => $data->customer->fname,
            "family_name" => $data->customer->lname,
            "owner_id" => $data->customer->owner->id,
            "email_addresses" => array(
                array(
                    "email" => $data->customer->email,
                    "field" => "EMAIL1"
                )
            ),
            "custom_fields" => array(
                array(
                    "id" => 3,
                    "content" => $data->customer->productline
                ),
                array(
                    "id" => 7,
                    "content" => $data->customer->referredby
                ),
                array(
                    "id" => 56,
                    "content" => $data->customer->other
                ),
                array(
                    "id" => 94,
                    "content" => $data->customer->eventname
                ),
                array(
                    "id" => 96,
                    "content" => $data->customer->companyname
                ),
                array(
                    "id" => 100,
                    "content" => $data->customer->assistantname
                ),
                array(
                    "id" => 64,
                    "content" => $data->customer->assistantemail
                ),
                array(
                    "id" => 98,
                    "content" => $data->customer->assistantphone
                ),
                array(
                    "id" => 104,
                    "content" => $data->customer->currentprovider
                ),
                array(
                    "id" => 110,
                    "content" => $data->customer->switchingproviderreason
                ),
                array(
                    "id" => 116,
                    "content" => $data->customer->salesrep
                )
            ),
            "lead_source_id" => $data->customer->campaign,
            "addresses" => array(
                array(
                    "field" => "BILLING",
                    "line1" => $data->customer->address1,
                    "line2" => $data->customer->address2,
                    "locality" => $data->customer->city,
                    "postal_code" => $data->customer->zip,
                    "region" => $data->customer->state,
                    "country_code" => "USA"
                )
            ),
            "phone_numbers" => array(
                array(
                    "field" => "PHONE1",
                    "number" => $data->customer->phone
                )
            )
        ], true);

        $contacts = $infusionsoft->contacts();
        $contacts->id = $contact->id;        
        
        if ($data->customer->phonecall == '') { // APPLY TAGS
            $data->customer->tags = $contacts->addTags([155, 534]); 

        } else {
            $data->customer->tags = $contacts->addTags([155, 534, $data->customer->phonecall ]);   
        }
        $data->customer->infusionsoft_id = $contact->id;
        unset($data->customer->phonecall);
        unset($data->customer->packagediscount);
    }

    if ($data->customer->email != '' && $data->customer->stage != '') {
        if ( $data->customer->stage == 0 ) { //CHECK IF OPORTUNITY EXIST
            $opportunity = $infusionsoft->data()->findByField('Lead', 1, 0, 'ContactID',  $data->customer->infusionsoft_id, array('Id'));
            $opportunityID = $opportunity[0];
        } else {
            $opportunity = $infusionsoft->opportunities()->create([
                "opportunity_notes" => $data->customer->salesnotes,
                "opportunity_title" => $data->customer->fname.' '.$data->customer->lname,
                "contact" => array(
                    "id" => $data->customer->infusionsoft_id,
                    "email" => $data->customer->email,
                    "first_name" => $data->customer->fname,
                    "last_name" => $data->customer->lname
                ), 
                "user" => array(
                    "id" => $data->customer->owner->id
                ),         
                "stage" => array(
                    "id" => $data->customer->stage
                )  
            ]);
            $opportunityID = $opportunity->id;

            if ( $data->customer->stage == 5 ) $sequence = 341;
            if ( $data->customer->stage == 8 ) $sequence = 331;
            if ( $data->customer->stage == 37 ) $sequence = 187;
            if ( $data->customer->stage == 35 ) $sequence = 167;
            if (isset($sequence)) {
                $api['request'] = 'POST';
                $api['header'] = array('Content-Type: application/json');
                $api['token'] = 'access_token='.$infutoken->accessToken.'&';
                $api['url'] = 'https://api.infusionsoft.com/crm/rest/v1/campaigns/1/sequences/'.$sequence.'/contacts?'.$api['token'];
                $api['bodycontent'] = '{
                    {
                    "ids": [ '.$data->customer->infusionsoft_id.' ]
                    }
                }';
                $data->customer->campaign = apirequest($api);
            }
        }
       
        $api['request'] = 'PATCH';
        $api['header'] = array('Content-Type: application/json');
        $api['token'] = 'access_token='.$infutoken->accessToken.'&';
        $api['url'] = 'https://api.infusionsoft.com/crm/rest/v1/opportunities/'.$opportunityID.'?'.$api['token'];
        $api['bodycontent'] = '{
            "user": {
                "id": '.$data->customer->owner->id.'
            }
        }';
        $data->customer->opportunity = apirequest($api);
        unset($data->customer->salesrep);
    }

    if (count($data->products) > 0) {
        $string = '';
        $data->customer->invoice->items = [];
        $invoice = $infusionsoft->invoices()->createBlankOrder($data->customer->infusionsoft_id, $data->customer->fname.' '.$data->customer->lname, $datetime, 0, 0);
        for ($x = 0; $x < count($data->products); $x++) {   
            $item = $infusionsoft->products()->find($data->products[$x]);
            $invoiceitems = $infusionsoft->invoices()->addOrderItem( $invoice, $item->id, 4, $item->product_price, 1, 'order item', '');
            $string .= ' ID: '.$item->id.', Name: '.$item->product_name.', Price: '.$item->product_price.'. <br> ';
            array_push($data->customer->invoice->items, $item);
        }
        $amount = $infusionsoft->invoices()->calculateAmountOwed($invoice);
        $payment = $infusionsoft->invoices()->addManualPayment($invoice, $amount, $datetime, 'Check', 'Offline Payment', false);
        $data->customer->invoice->id = $invoice;
        $data->customer->invoice->payment = $payment;
        $data->customer->dispatchnotes = $data->customer->dispatchnotes . $string;
    }
    unset($data->products);

    echo json_encode($data);
    wp_die();
}

function infusionsoft_sales_entry() {
    wp_enqueue_style( 'infusionsoft_sales_entry_css' );
    wp_enqueue_script( 'infusionsoft_sales_entry_js' );
    wp_enqueue_script( 'jirajs' );
    wp_enqueue_script( 'mc_googleapi' );
    ob_start();
    include('infusionsoft-sales-entry-html.php');
    return ob_get_clean();   
}


function infusionsoft_sales_entry_create_table() {
    global $table_prefix, $wpdb;
    $create_customers = 'CREATE TABLE IF NOT EXISTS '.$table_prefix.'infusionsoft_sales_entry_tokens (
        id INT NOT NULL AUTO_INCREMENT,
        infusionsoft_name VARCHAR(50),
        infusionsoft_value VARCHAR(1000),
        Infusionsoft_status VARCHAR(50),
        PRIMARY KEY (id))';
    require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
    dbDelta($create_customers);
}

register_activation_hook( __FILE__, 'infusionsoft_sales_entry_create_table' );
add_action( 'wp_enqueue_scripts', 'infusionsoft_sales_entry_enqueue_myscripts' );
add_action( 'admin_enqueue_scripts', 'infusionsoft_sales_entry_enqueue_myscripts' );
add_shortcode( 'shortcode_infusionsoft_sales_entry', 'infusionsoft_sales_entry' );
add_action( 'wp_ajax_nopriv_infusionsoft_sales_entry_api', 'infusionsoft_sales_entry_api' );
add_action('wp_ajax_infusionsoft_sales_entry_api', 'infusionsoft_sales_entry_api');
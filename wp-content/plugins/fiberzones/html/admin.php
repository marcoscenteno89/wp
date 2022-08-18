<?php  if ( ! defined( 'ABSPATH' ) ) { wp_die();  } ?>
<div class="fiberzones">
    <h2>Fiber Zones <button id="new-zone" class="btn green">Add New Zone</button> </h2>
    <?php
        global $table_prefix, $wpdb;
        $tb = $table_prefix."fiberzones_zones";
        $zones = $wpdb->get_results( "SELECT * FROM $tb" );
        
    ?>
    <table class="widefat">
        <thead><tr><th>ID</th><th>Name</th><th>Parent</th><th>Start Date</th><th>Start Date</th><th>Goal</th><th>Current</th><th>Stage</th><th>Shortcode</th><th>Edit</th><th>Delete</th></tr></thead>
        <tfoot><tr><th>ID</th><th>Name</th><th>Parent</th><th>Start Date</th><th>Start Date</th><th>Goal</th><th>Current</th><th>Stage</th><th>Shortcode</th><th>Edit</th><th>Delete</th></tr></tfoot>
    <tbody>
    <?php foreach( $zones as $zone ) { 
        $count = $wpdb->get_var("SELECT COUNT(*) FROM ".$table_prefix."fiberzones_customers WHERE zone = $zone->id");
        if ($zone->id != 0) $parent = $wpdb->get_row( "SELECT name FROM $tb WHERE id = (SELECT parent from $tb WHERE id = $zone->id)" );
    ?>
    <tr>
        <td><?php echo $zone->id; ?></td>
        <td><?php echo $zone->name; ?></td>
        <td><?php echo isset($parent) ? $parent->name : 'None'; ?></td>
        <td><?php echo $zone->startdate; ?></td>
        <td><?php echo $zone->enddate; ?></td>
        <td><?php echo $zone->goal; ?></td>
        <td><?php echo $count; ?></td>
        <td><?php echo $zone->stage; ?></td>
        <td>[mc_fz_shortcode id="<?php echo $zone->id; ?>"]</td>
        <td><button class="btn green select-zone" data-id="<?php echo $zone->id; ?>">Edit</button></td>
        <td><button class="btn red">Delete</button></td>
    </tr>
    <?php  }  ?>
    </tbody>
    </table>
    <div id="zoneform" class="popupitem">
        <div class="close">X</div>
        <form action="admin.php?page=Fiber_zones" class="content zone-form">
            <div class="tabs" style="width:100%;">
                <div id="percentage">
                    <span id="currentctm"></span> of <span id="totalctm"></span> goal
                    <div id="myProgress"><div id="myBar"></div></div>
                </div>
                <div class="tab validate">
                    <div class="basicinfo half">
                        <input type="hidden" class="form-input" name="id" id="id">
                        <input type="hidden" class="form-input" name="center" id="center">
                        <input type="hidden" class="form-input" name="zoom" id="zoom">
                        <input type="hidden" class="form-input" name="location" id="location">
                        <label for="name">Name<input type="text" class="form-input" name="name" id="name"></label>
                        <label for="startdate">Start Date<input type="date" class="form-input" name="startdate" id="startdate"></label>
                        <label for="enddate">End Date<input type="date" class="form-input" name="enddate" id="enddate"></label>
                        <label for="goal">Goal<input type="text" class="form-input" name="goal" id="goal"></label>
                        <label for="price">Price<input type="text" class="form-input" name="price" id="price"></label>
                        <label for="whale">Whale<input type="text" class="form-input" name="whaleprice" id="whaleprice"></label>
                        <label for="color">Color<input type="text" class="form-input" name="color" id="color"></label>
                        <label for="stage">Stage
                            <select class="form-input" name="stage" id="stage">
                                <option value="">Please Select </option>
                                <option value="design">Design</option>
                                <option value="signup">Sign Up</option>
                                <option value="construction">Construction</option>
                                <option value="connected">Connected</option>
                            </select>
                        </label>
                        <label for="parent">Parent Zone
                            <select class="form-input" name="parent" id="parent">
                                <option value="0">None</option>
                                <?php foreach( $zones as $zone ) echo "<option value='".$zone->id."'>".$zone->name."</option>"; ?>
                            </select>
                        </label>
                    </div>
                    <div id="map" class="map half"></div>
                    <label for="header" class="fullwidth">
                        <h3>Header</h3>
                        <?php wp_editor( '' , 'header', $settings = array('textarea_name' => 'header') ); ?>
                    </label>
                    <label for="zonedetails" class="fullwidth">
                        <h3>Details</h3>
                        <?php wp_editor( '' , 'details', $settings = array('textarea_name' => 'details') ); ?>
                    </label>
                    <label for="smallprint" class="fullwidth">
                        <h3>Smallprint</h3> 
                        <?php wp_editor( '' , 'smallprint', $settings = array('textarea_name' => 'smallprint') ); ?>
                    </label>
                </div>
                <div class="controller fullwidth">
                    <div class="status"></div>
                    <button name="next"  class="btn green">Save</button>
                    <button id="cancel" name="cancel" class="btn red">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</div>
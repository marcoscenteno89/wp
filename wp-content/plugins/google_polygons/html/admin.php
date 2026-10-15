<?php  if ( ! defined( 'ABSPATH' ) ) { wp_die();  } ?>
<div class="fiberzones">
  <h2>Fiber Zones <button id="new-zone" class="btn green">Add New Zone</button> </h2>
  <?php
    global $table_prefix, $wpdb;
    $tb = $table_prefix."fiberzones_zones";
    $zones = $wpdb->get_results( "SELECT * FROM $tb" );
    $url = admin_url('admin.php?page=google-polygons');
  ?>
  <table class="widefat">
    <thead><tr><th>ID</th><th>Name</th><th>Parent</th><th>Count</th><th>Shortcode</th><th>Edit</th><th>Delete</th></tr></thead>
    <tfoot><tr><th>ID</th><th>Name</th><th>Parent</th><th>Count</th><th>Shortcode</th><th>Edit</th><th>Delete</th></tr></tfoot>
  <tbody>
  <?php foreach( $zones as $zone ) { 
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $tb WHERE zone = $zone->id");
    if ($zone->id != 0) {
      $parent = $wpdb->get_row("SELECT name FROM $tb WHERE id = (SELECT parent from $tb WHERE id = $zone->id)");
    }
  ?>
  <tr>
    <td><?php echo $zone->id; ?></td>
    <td><?php echo $zone->name; ?></td>
    <td><?php echo isset($parent) ? $parent->name : 'None'; ?></td>
    <td><?php echo $count; ?></td>
    <td>[mc_fz_shortcode id="<?php echo $zone->id; ?>"]</td>
    <td><a href="<?php echo "$url/$zone->id/"; ?>" class="btn green select-zone">Edit</a></td>
    <td><button class="btn red">Delete</button></td>
  </tr>
  <?php  }  ?>
  </tbody>
  </table>
  <div id="zoneform" class="popupitem">
    <div class="close">X</div>
    <form action="admin.php?page=Fiber_zones" class="content zone-form">
      <div class="tabs" style="width:100%;">
        <div class="tab validate">
          <div class="basicinfo half">
            <input type="hidden" name="action" value="gp_create_zone">
            <input type="hidden" class="form-input" name="id" id="id">
            <input type="hidden" class="form-input" name="center" id="center">
            <input type="hidden" class="form-input" name="zoom" id="zoom">
            <input type="hidden" class="form-input" name="location" id="location">
            <input type="text" class="form-input" name="name" id="name">
            <input type="color" class="form-input" name="color" id="color">
            <select class="form-input" name="parent" id="parent">
              <option value="0">Parent Zone</option>
              <?php foreach( $zones as $zone ) echo "<option value='$zone->id'>$zone->name</option>"; ?>
            </select>
          </div>
          <div id="map" class="map half"></div>
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
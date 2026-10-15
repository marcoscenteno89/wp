<?php
  $atts = shortcode_atts( array( 'id' => '' ), $atts	);
  $thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large');
  global $table_prefix, $wpdb;
  $cst = $table_prefix."fiberzones_customers";
  $zn = $table_prefix."fiberzones_zones";
  $zone = $wpdb->get_row("SELECT * FROM $zn WHERE id = ".$atts['id']);
  $zone->contacts = $wpdb->get_results("SELECT location FROM $cst WHERE zone = $zone->id AND email > '' AND location > ''");
  $children = $wpdb->get_results("SELECT * FROM $zn WHERE parent = $zone->id"); 
  $children['contacts'] = $wpdb->get_results("SELECT location from $cst WHERE zone IN (SELECT id FROM $zn WHERE parent = $zone->id)");
?>
<script>
  const zone = <?php echo isset($zone) ? json_encode($zone) : '[]'; ?>;
  const children = <?php echo isset($children) ? json_encode($children) : '[]'; ?>;
  console.log(zone, children);
</script>
<div id="countdown">
  <h6>OFFER EXPIRES</h6>
  <div>
    <h6 class="counter"></h6>
    <strong><span>Days</span><span>Hrs</span><span>Min</span></strong>
  </div>
  <h6 class="hidden">GOAL</h6>
  <div class="bar">
    <span id="current" class="current circle"><?php echo sizeof($zone->contacts); ?></span>
    <div id="myProgress"><div id="myBar">*</div></div>
    <span id="total" class="total circle"><?php echo $zone->goal; ?></span>
  </div>
</div>
<section class="zoneprocess">
  <div id="map" style="width:100%;height:500px;"></div>
  <form action="" class="ifs-form verify-address">
    <div class="tabs">
      <div class="tab validate">
        <h3>To learn more,</h3>
        <h4>let's start with checking if your address is in the fiber zone.</h4>
        <input required type="text" class="form-input" name="line1" placeholder="Street">
        <input required type="text" class="form-input" name="locality" placeholder="City">
        <input required type="text" class="form-input" name="postal_code" placeholder="Zip Code">
        <input required type="text" class="form-input" name="region" placeholder="State">
      </div>
      <div class="controller fullwidth">
        <div class="status"></div>
        <button name="next" class="btn btnb w-100 red font-white">Continue</button>
        <button class="btn hidden block red font-white" id="gps">Add address with GPS</button>
        <button class="btn hidden block red font-white" id="manual">Input address location manually</button>
        <a class="btn hidden block red font-white" id="requestCoverage" href="/request-coverage/">Outside of the area? Click here</a>
        <button class="btn hidden font-black white" id="manualsubmit">Submit Address</button>
      </div>
    </div>
  </form>
</section>
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
<section class="zoneheader ph-15 pv-5" style="background-image: url(<?php echo $thumbnail[0]; ?>)">
    <div class="content ph-15 pv-5 font-white"><?php echo $zone->header; ?></div>
</section>
<section class="request_coverage red font-white">
    <h5>Elko residents outside of Spring Creek, <a href="/cities-we-serve/elko-nevada/"><h5 style=
    "display:inline;color:#FFFFFF;text-decoration:underline;">Click Here</h5></a> to request service.</h5>
</section>
<nav id="main-nav" class="font-blue ph-15 white">
    <a href="/"><img class="logo" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/logo-sf.png" alt=""></a>
    <ul id="nav" class="nav" data-ride="carousel">
        <li data-target="#zonecarousel" data-slide-to="0">DETAILS</li>
        <li data-target="#zonecarousel" data-slide-to="1">PACKAGES</li>
        <li data-target="#zonecarousel" data-slide-to="2">THE SAFELINK DIFFERENCE</li>
        <li><a href="#checkaddress" class="font-blue">CHECK COVERAGE</a></li>
    </ul>
    <i id="open" class="fas fa-bars active"></i>
    <i id="close" class="fas fa-times-circle"></i>
    <div id="countdown" class="red font-white">
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
</nav>
<section class="zonecarousel blue font-white flex">
    <div id="zonecarousel" class="carousel slide" data-ride="carousel" data-interval="15000">
        <ul class="carousel-indicators">
            <li data-target="#zonecarousel" data-slide-to="0" class="active"></li>
            <li data-target="#zonecarousel" data-slide-to="1"></li>
            <li data-target="#zonecarousel" data-slide-to="2"></li>
        </ul>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <h3>Details</h3>
                <p class="details"><?php echo $zone->details; ?></p>
            </div>
            <div class="carousel-item">
                <h3>Fiber plans being offered in your area.</h3>
                <div class="pack-content">
                    <div><span>Sonic 50</span><span>(50X50 Mbps)</span><span>$59/Mo</span></div>
                    <div><span>Sonic 100</span><span>(100X100 Mbps)</span><span>$74/Mo</span></div>
                    <div><span>Sonic 150</span><span>(150X150 Mbps)</span><span>$99/Mo</span></div>
                    <div><span>Sonic 500</span><span>(500X500 Mbps)</span><span>$149/Mo</span></div>
                    <div><span>Sonic 1000</span><span>(1000X1000 Mbps)</span><span>$249/Mo</span></div>
                </div>
            </div>
            <div class="carousel-item">
                <h3>The Safelink Difference</h3>
                <p>Safelink is the only internet provider in the area to own and utilize a redundant fiber ring that is connected to hubs in both Seattle and Salt Lake City. If that ring is ever cut the signal will "heal" itself by redirecting the signal. Your new connection will be a solid fiber connection that is connected directly to the Safelink Internet backbone. This ensures everyone gets fiber speeds and a reliable connection that was previously only dreamt of in denser areas.</p>
            </div>
        </div>
        <a class="carousel-control-prev" href="#zonecarousel" data-slide="prev"><span class="carousel-control-prev-icon"></span></a>
        <a class="carousel-control-next" href="#zonecarousel" data-slide="next"><span class="carousel-control-next-icon"></span></a>
    </div>
    <img src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/img2.jpeg" alt="">
</section>
<section class="zonestage ph-15 pv-2 gray">
    <h3 class="font-blue">The Construction Process</h3>
    <br>
    <div id="pointer-list">
        <div class="design pointer">
            <h5>step 1 <i class="fas fa-check"></i></h5>
            <h4>Design</h4>
        </div>
        <div class="signup pointer">
            <h5>step 2 <i class="fas fa-file-signature"></i></h5>
            <h4>Sign Up</h4>
        </div>
        <div class="construction pointer">
            <h5>step 3 <i class="fas fa-tools"></i></h5>
            <h4>Construction</h4>
        </div>
        <div class="connected pointer">
            <h5>step 4 <i class="fas fa-network-wired"></i></h5>
            <h4>Connected</h4>
        </div>
    </div>
</section>
<section class="zoneprocess ph-15 pv-5 flex blue font-white">
    <div id="map"></div>
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
<footer class="ph-15 pv-5 font-blue">
    <h3>CONTACT US</h3>
    <div class="site-info">
        <div><a href="tel:+12086778000" class="font-blue"><i class="fas fa-phone"></i> 208.677.8000 </a></div>
        <div><i class="fas fa-map-marker-alt"></i> 601 W 19th St <br>Idaho Falls, ID 83402 </div>
        <div><i class="fas fa-envelope"></i><a href="mailto:info@safelinkinternet.com" class="font-blue">info@safelinkinternet.com</a></div>
        <div><img src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/Logo-Safelink.png" alt=""> <br><i>2018 Copyright. All Rights Reserved</i></div>
    </div>
    <p class="disclaimer pv-5">All plans require a $9.95 monthly equipment lease to cover equipment and Wi-Fi enabled router. Pricing is subject to change. Call Safelink Internet for details.</p>
</footer>
<section id="background" class="flex ph-15 pv-3 hidden"></section>
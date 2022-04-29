<script>sessionStorage.setItem("agiletoken", "<?php echo get_option('agile_token'); ?>");</script>
<section>
<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img class="d-block w-100" src="/wp-content/uploads/2021/11/one.png" alt="First slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/wp-content/uploads/2021/11/three.png" alt="Second slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="/wp-content/uploads/2021/11/two.png" alt="Third slide">
    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
</section>
<nav class="navbar main-nav navbar-expand-lg navbar-dark">
  <div class="container">
    <a class="navbar-brand" href="/">
      <img class="logo" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/logo-an.png">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent" style="justify-content:flex-end;">
      <ul class="navbar-nav">
        <li><a href="#anthemDifference" class="font-blue">The Anthem Difference</a></li>
        <li><a href="#plansServices" class="font-blue">Packages</a></li>
        <li><a href="#theProject" class="font-blue">The Project</a></li>
        <li><a href="#constructionzone" class="font-blue">Construction Zone</a></li>
        <li><a href="#whatAboutSafelink" class="font-blue">What about Safelink</a></li>
      </ul>
    </div>
  </div>
</nav>
<article class="container">
  <?php echo do_shortcode('[checkei]'); ?>
  <div class="row">
    <div class="col-9">
      <section>
        <h2 style="font-weight:300;font-size:2.5rem;margin:2rem 0;">
          Anthem Broadband, in partnership with Nevada Gold Mines, is redefining internet in Elko!
        </h2>
        <p><strong>
          <a href="/#whatAboutSafelink">Click Here</a>
          To learn about the name change from Safelink Internet to Anthem Broadband.
        </strong></p>
      </section>

      <section id="anthemDifference">
        <h1 class="heading">Anthem Does Fiber Internet Differently!</h1>
        <h2>Pay half as much and get more!</h2>
        <p>Unlike other providers, Anthem Broadband provides a dedicated, fiber connection from your home to the main switch. You won’t share a connection with your neighbors and can rely on our redundant links to guarantee greater connectivity and reliability than anyone else! Learn More (link down to “the project”)</p>
        <p><strong>We tell our customers “no” a lot – like no fees, no data caps, no credit checks, no rentals, and more.</strong></p>
        <h2>Think of what you could do with Gig speeds, especially when it’s only $119!</h2>
        <br>
        <div class="flex-row" style="justify-content:space-between;">
          <span style="width:60%;">
            <h4>Keep everyone connected and happy.</h4>
            <p>There is enough speed to go around. Stream movies, play games, video chat, shop, and so much more. Everyone can do their own thing and not worry about how it affects others.</p>
            <h4>Stay in control.</h4>
            <p>Anthem’s own Parental Controls and device management makes it easy to pause the internet, set limits, review data usage, and control your Wi-Fi.</p>
            <h4>Watch what you want.</h4>
            <p>No cable needed. With so many streaming services available, you can always find the programs you love to watch, when you want to watch them. With a gig of internet, everyone in the house can stream on their own device without experiencing buffering or downtime. Now all you need is a lot more popcorn to enjoy the shows. </p>
          </span>
          <span style="width:40%;"><img style="width:100%;" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/res-01.svg" /></span>
        </div>
        <div class="flex-row" style="justify-content:space-between;">
          <span style="width:50%;"><img style="width:70%;" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/res-02.svg" /></span>
          <span style="width:50%;">
            <h4>Give everyone a phone</h4>
            <p>Bundle your service with a residential or business VoIP phone service. It’s the perfect marriage of a home phone and the internet. Get unlimited minutes and put phones in every room so you don’t have to buy the kids cell phones. Turn voicemail into emails, forward calls to other phones, even take your home phone number with you when you travel.</p>
          </span> 
        </div>
        <div class="flex-row" style="justify-content:space-between;">  
          <span style="width:50%;">
            <h4>Protect your home</h4>
            <p>Home security and internet go hand in hand. By bundling a home security system you’ll always know what is happening at home, whether you’re at the store or on the other side of the world. Motion sensors, door alarms, video cameras, and other monitoring tools make it easy to keep tabs on what’s going on when you are away.</p>
          </span>
          <span style="width:50%;"><img style="width:100%;" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/fib-01.svg" /></span>
        </div>
        <div class="flex-row" style="justify-content:space-between;">
          <span style="width:50%;"><img style="width:80%;" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/fib-02.svg" /></span>
          <span style="width:50%;">
            <h4>Need Help? We’re here.</h4>
            <p>We have real humans waiting to help you. Our tech support team is available 24/7 to help with any issue and when you talk to a local employee right here in the U.S.A.!</p>
          </span>
        </div>
      </section>

      <section id="plansServices">
        <h2 class="heading">Plan & Services</h2>
        <h3>Internet Services</h3>
        <div class="tb">
          <section class="flex-center" style="padding:2rem 0;flex-wrap:wrap;">
          <div class="package">
            <h5>2GB/2GB</h5>
            <span>only</span>
            <h2>$249</h2>
            <ul>
              <li>No construction fee</li>
              <li>No installation fee</li>
              <li>No contracts</li>
              <li>No data caps</li>
            </ul>
            <a class="btn pakbtn" href="#verify-address">Get Started</a>
          </div>
          <div class="package popular">
            <h5>1GB/1GB</h5>
            <span>only</span>
            <h2>$119</h2>
            <ul>
              <li>No construction fee</li>
              <li>No installation fee</li>
              <li>No contracts</li>
              <li>No data caps</li>
            </ul>
            <a class="btn pakbtn" href="#verify-address">Get Started</a>
          </div>
          <div class="package">
            <h5>500Mb/500Mb</h5>
            <span>only</span>
            <h2>$99</h2>
            <ul>
              <li>No construction fee</li>
              <li>No installation fee</li>
              <li>No contracts</li>
              <li>No data caps</li>
            </ul>
            <a class="btn pakbtn" href="#verify-address">Get Started</a>
          </div>
          <div class="package">
            <h5>250Mb/250Mb</h5>
            <span>only</span>
            <h2>$79</h2>
            <ul>
              <li>No construction fee</li>
              <li>No installation fee</li>
              <li>No contracts</li>
              <li>No data caps</li>
            </ul>
            <a class="btn pakbtn" href="#verify-address">Get Started</a>
          </div>
        </div>
			</section>

      <section>
        <div>
          <p><strong><a href="#verify-address">Check availability</a></strong> 
            to see what other plans are available in your area. Every plan includes our own</p>
          <p>Parental Controls built in and Managed Wi-Fi at no additional cost</p>
        </div>
        <h3>Additional Services</h3>
        <div class="tb">
          <div class="flex-row">
            <strong>Customizable VoIP phone system for home or business</strong><span>Starting at $19/month</span>
          </div>
          <div class="flex-row">
            <strong>Home Security and automation</strong><span>Call for a free quote</span>
          </div>
          <div class="flex-row">
            <strong>Structured cabling and home connectivity solutions </strong><span>Call for a free quote</span>
          </div>
        </div>
      </section>

      <section id="theProject">
        <h2 class="heading">About the Project</h2>
        <p>The area’s best internet is coming!</p>
        <p>Anthem Broadband is actively constructing a new fiber internet project that will bring all of Elko and Spring Creek the fastest and most reliable fiber internet service available. This new plan is scheduled to be completed in as little as two years, without being reliant on the schedules of others, like the gas company. Those that sign up will have NO construction fee, NO installation fee, NO activation fee, and NO contract. We believe you will be so amazed by the service you’ll never want to go anywhere else.</p>
        <p>The new Digital Transformation Project will utilize redundant service paths to the east and west to provide the most reliable service available. We will also be utilizing a lesser used installation practice, called Active Ethernet, that will give every location a direct connection back to a switch, not a shared line that could mean your neighbors can affect the speeds you are getting.</p>
        <p>To learn more about Active Ethernet, <strong><a href="#activeEthernet">Click Here</a></strong></p>
        <p>
          <strong>To get started and to see when service will be available in your area, enter your address and click “check now” </strong>
        </p>
      </section>
      
      <section id="constructionzone">
        <div class="w-100" style="position:relative;">
          <img class="w-100" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/map.svg" />
          <img style="position:absolute;width:60%;left:0;top:0;" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/plan.png" />
        </div>
        <div style="background:#02666c;color:#FFF;text-align:center;padding:2vw 4vw;">
          <h3 style="color:#FFF;">COMPARE THE DIFFERENCE</h3>
          <p>Fiber is the ultimate in internet technology. Unlike traditional methods (like cable or DSL), ﬁber optic internet uses light signals to carry data rather than metallic wires and electrical signals that can corrode. This allows ﬁber to carry much more information than cable without loss.</p>
          <p style="margin-bottom:0;">Anthem uses Active Ethernet ﬁber, an installation practice that gives each home a dedicated, direct connection, so you don’t share bandwidth with others in your neighborhood. You won’t experience slowdowns during times of heavy internet usage, and it’s all backed with our exclusive Satisfaction Guarantee.</p>
        </div>
        <div class="flex-row fiber-difference row" style="position:relative;">
          <img class="ftimg desktop" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/fib-12.svg" />
          <div>

            <section class="bg fiber-difference">
              <img class="w-100" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/fib-10.svg" />
            </section>

            <section class="fiber-difference block-content">
              <div class="col-12 green-block flex-col">
                <h3 id="activeEthernet">Anthem</h3>
                <p>Each home has a direct connection to the mainline.</p>
                <strong style="margin-bottom:0.6rem;">CONNECTIVITY: ACTIVE ETHERNET</strong>
                <span class="flex-row w-100">
                  <ul>
                    <li><strong>Pros:</strong></li>
                    <li>Dedicated Connection</li>
                    <li>Easier to upgrade</li>
                    <li>High security</li>
                    <li>Not affected by neighbors</li>
                    <li>We include a redundant path for greater reliability</li>
                  </ul>
                  <ul>
                    <li><strong>Cons:</strong></li>
                    <li>Higher upfront cost</li>
                  </ul>
                </span>
              </div>
            </section>
          </div>
          <div>
            <section class="bg fiber-difference">
              <img class="w-100" src="<?php echo plugin_dir_url( __FILE__ ); ?>../img/fib-11.svg"/>
            </section>
            <section class="fiber-difference block-content">
              <div class="col-12 green-block flex-col">
                <h3>Other brands</h3>
                <p>Many homes share one fiber line that weakens connectivity.</p>
                <strong style="margin-bottom:0.6rem;">CONNECTIVITY: GPON</strong>
                <span class="flex-row w-100">
                  <ul>
                    <li><strong>Pros:</strong></li>
                    <li>Lower upfront cost</li>
                    <li>Faster construction</li>
                  </ul>
                  <ul>
                    <li><strong>Cons:</strong></li>
                    <li>Shared connections</li>
                    <li>Easier to take down entire neighborhoods</li>
                    <li>More difficult to upgrade</li>
                    <li>Less Secure</li>
                  </ul>
                </span>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="whatAboutSafelink">
        <h2 class="heading">What Happened to Safelink?</h2>
        <p>Safelink Internet is now Anthem Broadband! The name change is a result of a rebranding effort designed to mirror the growth, transformation, and future vision of the company.</p>
        <p>The new direction includes new product plans, a list of new services, and an enhanced focus on customer service and creating an exceptional experience for every subscriber. One of our primary goals is to remove any obstacle that customers would typically experience when signing up for new service. Customers will NOT have any activation or installation fee, construction fee, credit check, or contract. Every service will continue to include no data caps, no throttling, a Wi-Fi managed router, and parental controls built in. New services will also include bundle options of an enhanced residential and business VoIP phone and fax as well as a list home security and automation solutions.</p>
        <p>During all its history, Safelink Internet has been focused on connecting communities and creating solutions for rural areas that would otherwise have little to no option for internet service. As a result, Safelink has become a leader in the industry and the largest wireless internet service provider in Idaho and the surrounding areas.</p>
        <p>Nevertheless, our business has undergone a significant transformation in the last few years that has justified a new brand that will better reflect where the company is and where we plan to be in the future. Anthem has been designed to reflect what our original mark stood for while simultaneously moving the brand forward, acknowledging our new company culture and our focus on, and dedication to, the future of internet technologies.</p>
        <p>In this sense, Anthem represents an evolution from our previous experience, origins, and roots to also reflect our focus on the future and our driving passion of using the very best technologies to connect communities to what matters most to them, whether that be work, family, school, shopping, hobbies, games, and more. We encourage everyone to join the Anthem and find their voice in this digital era where the world is at your fingertips.  </p>
      </section>

	  <footer style="text-align:center;">
		<p>Copyright © <?php echo date('Y'); ?> Anthem Broadband. All rights reserved</p>
	  </footer>
    </div>
    <div class="col-3 sidebar flex-col">
      <div class="form-area flex-col">
        <h5>Find out when service is available in your area</h5>
        <p style="color:#212529;">Enter your address to get started</p>
        <form action="/signup" class="verify-address" id="verify-address">
          <div class="tabs">
			      <div class="steps"></div>
            <div class="tab" data-props='{"name":"Check Address","numerate":true,"validate":true}'>
              <input type="hidden" class="form-input" name="utm_adgroup" value="*">
              <input type="hidden" class="form-input" name="utm_campaign" value="*">
              <input type="hidden" class="form-input" name="utm_source" value="organic">
              <input type="hidden" class="form-input" name="utm_medium" value="*">
              <input type="hidden" class="form-input" name="utm_term" value="*">
              <input type="hidden" class="form-input" name="utm_content" value="*">
              <input required type="text" class="form-input" name="line1" placeholder="Street">
              <input required type="text" class="form-input" name="locality" placeholder="City">
              <input required type="text" class="form-input" name="region" placeholder="State">
              <input required type="text" class="form-input" name="postal_code" placeholder="Zip Code">
            </div>
            <div class="controller">
              <div class="status"></div>
              <button name="next" id="btn" class="btn cta">Check Now</button>
              <!-- <button class="btn hidden secondary" id="manual">Add location manually</button> -->
              <!-- <button class="btn hidden secondary" id="manualsubmit">Submit Address</button> -->
            </div>
          </div>
		      <h5>Just have questions?</h5>
          <p style="color:#212529;">
            Please call <a href="tel:+17753892894" style="font-weight:bold;">775-389-2894</a>
          </p>
        </form>
      </div>
      <h5 style="color:#FFF;">What makes it unique?</h5>
      <h6 style="color:#FFF;">We say "No" a LOT</h6>
      <ul>
        <li>NO construction fee</li>
        <li>NO installation fee</li>
        <li>NO activation fee</li>
        <li>NO contract</li>
        <li>NO data caps</li>
        <li>NO throttling</li>
        <li>NO credit check</li>
        <li>NO rental</li>
        <li>NO waiting for the gas company</li>
      </ul>
      <h6 style="color:#FFF;">Includes: </h6>
      <ul>
        <li>Wi-Fi Managed Router</li>
      </ul>
    </div>
  </div>
</article>
<section id="background" class="hidden" style="background-color:rgba(0,0,0,0.8);">
  <!-- <div id="popup">
    <div class="close">X</div>
    <div class="content">
      <h2 class="heading flex-center" style="color:#fff;text-align:center;padding:1rem;">
        Zoom in, then click to place a pin on your home or business.
      </h2>
      <form action="/signup" class="verify-address" id="verify-address">
        <div class="tabs">
          <div class="steps"></div>
          <div class="tab" data-props='{"name":"Check Address","numerate":true,"validate":true}'>
            <input type="hidden" class="form-input" name="utm_adgroup" value="*">
            <input type="hidden" class="form-input" name="utm_campaign" value="*">
            <input type="hidden" class="form-input" name="utm_source" value="organic">
            <input type="hidden" class="form-input" name="utm_medium" value="*">
            <input type="hidden" class="form-input" name="utm_term" value="*">
            <input type="hidden" class="form-input" name="utm_content" value="*">
            <input type="hidden" class="form-input" name="line1">
            <input type="hidden" class="form-input" name="locality">
            <input type="hidden" class="form-input" name="region">
            <input type="hidden" class="form-input" name="postal_code">
          </div>
          <div class="controller">
            <div class="status"></div>
            <button name="next" id="btn" class="btn cta">Submit Address</button>
          </div>
        </div>
      </form>
      <div id="map"></div>
    </div>
  </div> -->
  
  <!-- <button style="margin:1rem;color:#fff;" class="btn cta" id="manualsub">Submit</button> -->
</section>
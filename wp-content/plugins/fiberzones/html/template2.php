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
  <section class="row" style="padding-top:4rem;">
    <div class="col-9">
      <div class="row">
        <div class="col-10">
          <h2>The Anthem Difference</h2>
          <p>All fiber networks are not the same. Other providers settle for installing a cheaper GPON network which is a point-to-multipoint access network. Put simply, they take a single line from the distribution point and split it out to multiple locations, with as many as 32 homes on one line. So, you may pay for 1 gig connection, but you’re really sharing that connection with up to 31 of your neighbors. You only get a 1 gig connection if you are the only one online.</p>
          <p>Anthem broadband utilizes high quality Active Ethernet (Active E), a point-to-point internet connection. This means you have a dedicated fiber line from your home all the way to the switch. By having a dedicated line, you don’t experience fluctuations in speed. You get a direct, dedicated connection and the speed you pay for.</p>
          <p>The fiber line that connects to your home must be connected to “the world wide web.” To save cost, other providers utilize a single line that goes to a single server. If that line goes down, so does your connection.</p>
          <p>Anthem broadband utilizes redundant paths and multiple servers. So, if one line goes  down, your service is automatically rerouted to another line, and you don’t lose connection. Att Anthem, we even take this a step further by also including redundant local service paths in town.</p>
          <br>
          <h2>Plans/Pricing</h2>
          <p>Others may offer lower upfront pricing, but read the fine print - there’s a lot of it! Your price will go up after the promotional period. You’ll have to “rent” your router for an extra monthly cost, and you’ll pay extra per month for managed Wi-Fi. Put plainly, the monthly price advertised is not the price you will pay. Our pricing is upfront, hones and all-inclusive.</p>
        </div>
      </div>
    </div>
    <div class="col-3 sidebar">
        <h5 style="color:#FFF;">Find out when service is available in your area</h5>
        <p>Enter your address to get started</p>
        <style>
          #primary.primary {
              background-color: #FFF !important;
          }
          form .steps {
              border-radius: 5px;
              overflow: hidden;
          }
          form .steps .step {
              color: #fff !important;
              padding-top: 10px;
              padding-bottom: 10px;
          }
          .tabs .tab {
              padding: 10px 0 0 0 !important;
          }
        </style>
        <form action="/signup" class="verify-address" id="verify-address">
          <div class="tabs">
            <div class="steps" hidden></div>
            <div class="tab" data-props='{"name":"Check Address","numerate":true,"validate":true}'>
              <input type="hidden" class="form-input" name="utm_adgroup" value="*">
              <input type="hidden" class="form-input" name="utm_campaign" value="*">
              <input type="hidden" class="form-input" name="utm_source" value="organic">
              <input type="hidden" class="form-input" name="utm_medium" value="*">
              <input type="hidden" class="form-input" name="utm_term" value="*">
              <input type="hidden" class="form-input" name="utm_content" value="*">
              <input type="hidden" class="form-input" name="o" value="5">
              <input type="hidden" class="form-input" name="lat">
              <input type="hidden" class="form-input" name="lng">
              <input type="hidden" class="form-input" name="project_id" value="58">
              <input required type="text" class="form-input" name="line1" placeholder="Address">
              <input type="text" class="form-input" name="line2" placeholder="Address Line 2">
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
          <h5 style="color:#FFF;">Just have questions?</h5>
          <p>Please call <a href="tel:+17753892894" style="font-weight:bold;color:#FFF;">775-389-2894</a></p>
        </form>
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
  </section>
  <section class="row alert-secondary" style="padding-top:1rem;">
    <div class="col-4">
      <style>
        [data-template="2"] .anim-container {
          width: 80% !important;
        }
        [data-template="2"] .action {
          display: none;
        }
        [data-template="2"] .amount, [data-template="2"] .title {
          padding: 0 0.5rem;
        }
      </style>
      <div data-packages="true" data-type="elko" data-productline="residential" data-template="2"></div>
    </div>
    <div class="col-8">
      <style>
        table {
          width: 100%;
        }
        table tr th:nth-of-type(1), table tr td:nth-of-type(1) {
          width: 70%;
        }
        table tr th:nth-of-type(2), table tr td:nth-of-type(2), 
        table tr th:nth-of-type(3), table tr td:nth-of-type(3) {
          text-align: center;
          width: 15%;
        }
      </style>
      <table>
        <tr>
          <th></th>
          <th>Anthem</th>
          <th>Other ISPs</th>
        </tr>
        <tr>
          <td>Redundant fiber backbone connections for maximum reliability</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Redundant distribution paths for enhanced connectivity</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Your own dedicated connection</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Guaranteed speeds</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Upfront pricing with no fine print</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Service contract</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>Free managed Wi-Fi and routers on ALL plans</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
        <tr>
          <td>24/7 Local service from local employees and 24/7 network monitoring</td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #0f5132;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-check-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
            </svg>
          </td>
          <td>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style="color: #842029;"
              width="16" 
              height="16" 
              fill="currentColor" 
              class="bi bi-x-square-fill" 
              viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
            </svg>
          </td>
        </tr>
      </table>
    </div>
    <div class="col-12" style="background-color:#009bab;">
      <p>To get started, choose your plan and click "hook me up</p>
      <p>To get your home connected to the fiber network without subscribing to our sevice, just click the button.</p>
      <button class="cta btn">Hook me up!</button>
    </div>
  </section>
  <footer style="text-align:center;">
    <p>Copyright © <?php echo date('Y'); ?> Anthem Broadband. All rights reserved</p>
  </footer>
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
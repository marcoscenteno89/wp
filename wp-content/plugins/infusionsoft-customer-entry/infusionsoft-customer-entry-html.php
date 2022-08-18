<section class="cst_order_header" style="background-image: url(<?php echo plugin_dir_url( __FILE__ ); ?>/img/header-image.jpg)">
    <div class="calltoaction">
        <div>
            <h1>Loking for better internet?</h1>
            <h1>You found it!</h1>
            <a class="btn" href="#customerform">BUY NOW</a>
        </div>
    </div>
    <div class="accordion">
        <div class="top">
            <h3 class="one active" id="one" name="displaylist">Learn More</h3>
            <h3 class="two" id="two" name="displaylist">Customers Reviews</h3>               
            <h3 class="three" id="three" name="displaylist">Quote Request</h3>                 
        </div>
        <div class="bottom">
            <div class="one active" name="displaylist">
                <h3 class="head">EVERY PLAN INCLUDES:</h3>
                <div class="body">
                    <div>
                        <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/price-lock.png" alt="">
                        <p>price lock for life</p>
                    </div>
                    <div>
                        <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/cloud.png" alt="">
                        <p>unlimited data</p>
                    </div>
                    <div>
                        <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/unlimited-data.png" alt="">
                        <p>built in wi-fi</p>
                    </div>
                    <div>
                        <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/guardian.png" alt="">
                        <p>Guardian include</p>
                    </div>
                    <div>
                        <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/local-support.png" alt="">
                        <p>24/7 customer support</p>
                    </div>
                </div>
            </div> 
            <div class="two" name="displaylist">
                <?php echo do_shortcode('[displayreviewsoutput]'); ?>
            </div> 
            <div class="three" name="displaylist">
                <h3 class="head">GET A QUOTE</h3>
                <div class="body">
                    <p>
                        Not sure where to start<br />
                        We can help! Request a quote and we'll help pick the  plan that fits your lifestyle best.<br />
                        or call <a href="tel:+1208677800" class="phone">208-677-8000</a>
                    </p>
                    <form accept-charset="UTF-8" action="https://di427.infusionsoft.com/app/form/process/4e4fc6246ef41b17654a11808909fcb7" class="infusion-form" id="inf_form_4e4fc6246ef41b17654a11808909fcb7" method="POST">
                        <input name="inf_form_xid" type="hidden" value="4e4fc6246ef41b17654a11808909fcb7" />
                        <input name="inf_form_name" type="hidden" value="City Pages form" />
                        <input name="infusionsoft_version" type="hidden" value="1.70.0.52087" />
                        <input class="infusion-field-input" id="inf_field_FirstName" name="inf_field_FirstName" placeholder="First Name" type="text" />
                        <input class="infusion-field-input" id="inf_field_LastName" name="inf_field_LastName" placeholder="Last Name" type="text" />
                        <input class="infusion-field-input" id="inf_field_Email" name="inf_field_Email" placeholder="Email" type="text" />
                        <input class="infusion-field-input" id="inf_field_Phone1" name="inf_field_Phone1" placeholder="Phone" type="text" />
                        <input class="infusion-field-input" id="inf_custom_PromoCode" name="inf_custom_PromoCode" placeholder="Promo Code" type="text">
                        <p class="center"><button class="formbtn btn" type="submit">Get a quote</button></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="readyorder">
    <div class="innerblock">
        <div>
            <h2>READY TO ORDER?</h2>
            <p>It's easy, Just follow the steps below and place an order. <br>
                We'll review your details and follow up to schedule an installation date.
            </p>
        </div>
        <div>
            <h3 class="top">INTERESTED IN BUSINESS PLANS? <i class="fas fa-angle-down"></i></h3>
            <div class="bottom">
                <p>Enter your contact info and we'll start the quote process</p>
                <form accept-charset="UTF-8" action="https://di427.infusionsoft.com/app/form/process/4e4fc6246ef41b17654a11808909fcb7" class="infusion-form" id="inf_form_4e4fc6246ef41b17654a11808909fcb7" method="POST">
                    <input name="inf_form_xid" type="hidden" value="4e4fc6246ef41b17654a11808909fcb7" />
                    <input name="inf_form_name" type="hidden" value="City Pages form" />
                    <input name="infusionsoft_version" type="hidden" value="1.70.0.52087" />
                    <input class="infusion-field-input" id="inf_field_FirstName" name="inf_field_FirstName" placeholder="First Name" type="text" />
                    <input class="infusion-field-input" id="inf_field_LastName" name="inf_field_LastName" placeholder="Last Name" type="text" />
                    <input class="infusion-field-input" id="inf_field_Email" name="inf_field_Email" placeholder="Email" type="text" />
                    <input class="infusion-field-input" id="inf_field_Phone1" name="inf_field_Phone1" placeholder="Phone" type="text" />
                    <button class="formbtn btn" type="submit">Get a quote</button>
                </form>
            </div>
        </div>
    </div>
</section>
<section class="progressbarcontainer">
    <div class="pro-container">
        <ul class="progressbar">
            <a href="#packages"><li>Packages</li></a>
            <a href="#discounts"><li>Discounts</li></a>
            <a href="#other"><li>Add Ons</li></a>
            <a href="#finalize"><li>Check Out</li></a>
        </ul>
    </div>
</section>
<form id="customerform" class="clientform">
    <div class="step1">
        <section class="packages product" id="packages">
            <h1>CHOOSE A PLAN</h1>
            <p class="paragraph">Select the plan that works best for you. Each plan includes unlimited data, price-lock for life, and Guardian content filtering and device management.</p>
            <div id="packagelist"  class="packageslist">
                <!-- <input type="radio" class="package" name="packages" id="savings" value="&productId=95&productQuantity=1"> 
                <label class="savings" for="savings">
                    <h2>$35</h2>
                    <h3>SAVINGS</h3>
                    <p>No HD streaming</p>    
                    <p type="button"  class="addtocart btnimportant">Select</p>           
                </label> -->
                <input type="radio" class="package" name="packages" id="streaming" value="99" data-discount="217">
                <label class="streaming" for="streaming">
                    <h3>STREAMING</h3>
                    <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/streaming.png" alt="streaming package" class="priceimg">
                    <strong>2:47 Minutes</strong>
                    <p>To download 100 MB file</p>
                    <strong>HD Video Streams</strong>
                    <p>1 Device Supported</p>
                    <strong class="mobilehide">Guardian Essentials</strong>
                    <p class="mobilehide">Included</p>
                    <p class="addtocart btnimportant">Select</p>
                </label>
                <input type="radio" class="package" name="packages" id="family" value="105" data-discount="219">
                <label class="family" for="family">
                    <h3>FAMILY</h3>
                    <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/family.png" alt="family package" class="priceimg">
                    <strong>1:23 Minutes</strong>
                    <p>To download 100 MB file</p>
                    <strong>HD Video Streams</strong>
                    <p>2 Devices Supported</p>
                    <strong class="mobilehide">Guardian Essentials</strong>
                    <p class="mobilehide">Included</p>
                    <p class="addtocart btnimportant">Select</p>
                </label>
                <input type="radio" class="package" name="packages" id="tech" value="113" data-discount="223">
                <label class="tech" for="tech">
                    <h3>TECH</h3>
                    <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/tech.png" alt="tech package" class="priceimg">
                    <strong>0:55 Seconds</strong>
                    <p>To download 100 MB file</p>
                    <strong>HD Video Streams</strong>
                    <p>3 Devices Supported</p>
                    <strong class="mobilehide">Guardian Essentials</strong>
                    <p class="mobilehide">Included</p>
                    <p class="addtocart btnimportant">Select</p>
                </label>
                <input type="radio" class="package" name="packages" id="power" value="129" data-discount="225">
                <label class="power" for="power">
                    <h3>POWER</h3>
                    <img src="<?php echo plugin_dir_url( __FILE__ ); ?>/img/power.png" alt="power package" class="priceimg">
                    <strong>0:41 Seconds</strong>
                    <p>To download 100 MB file</p>
                    <strong>HD Video Streams</strong>
                    <p>4 Devices Supported</p>
                    <strong class="mobilehide">Guardian Essentials</strong>
                    <p class="mobilehide">Included</p>
                    <p class="addtocart btnimportant">Select</p>
                </label>
            </div>
            <p class="paragraph fineprint">*New activations have a standard installation of $90 that can be waived with a 1-year agreement and auto-pay. Every account requires a $9.95 monthly equipment lease to cover antenna and router and a $10 one-time activation fee.  Internet speeds available vary by market and towers. May not be combined with any other offer. Other restrictions may apply, call Safelink Internet for details.</p>
        </section>
        <section class="discounts product" id="discounts">
            <h1>Add Your Discounts</h1>
            <p class="paragraph">With Safelink Internet there are lots of ways to save! Select the discounts that work best for you. Don’t forget, after you become a customer you can save even more with our Share and Save program. Just refer friends and neighbors for even greater discounts.</p>
            <div id="discountlist" class="discountlist">
                <div>            
                    <div>
                        <h3 class="red">1 Year Agreement</h3>
                        <h3 class="price">$65 OFF</h3>
                    </div>
                    <p class="fineprint">Just one year is all we ask.</p>
                    <input type="checkbox" class="disc" name="contract" id="contract" value="203">
                    <label for="contract"><p class="addtocart">Add</p></label>
                </div>
                <div>            
                    <div>
                        <h3 class="red">Auto-pay</h3>
                        <h3 class="price">$25 OFF</h3>   
                    </div>                
                    <p class="fineprint">Don’t worry about monthly payments. Sign up once and we’ll send you a receipt each month for your records.</p>
                    <input type="checkbox" class="disc" name="autopay" id="autopay" value="207">
                    <label for="autopay"><p class="addtocart">Add</p></label>
                </div>
                <div>
                    <div>
                        <h3 class="red">Military Discount</h3>
                        <h3 class="price">$5.50/mo OFF</h3>
                    </div>                
                    <p class="fineprint">Served in the US Military. We want to say thanks with an extra discount.</p>
                    <input type="checkbox" class="disc" name="military" id="military" value="237">
                    <label for="military"><p class="addtocart">Add</p></label>
                </div>
                <div>           
                    <h3 class="red">Promo Code</h3>
                    <p class="fineprint">Have a Promo Code? Enter it Here</p>           
                    <input type="text" class="promovalue" id="promovalue" name="promovalue">
                </div>
            </div>
        </section>
        <section class="other product" id="other">
            <h1>Extra Products</h1>
            <p class="paragraph">Bundle and save. Lower your montly bill and make life easier with these great products</p>
            <div id="otherlist" class="otherlist">
                <div>
                    <h3 class="red">VoIP</h3>
                    <strong id="four" class="showdetails">Details</strong>
                    <h3 class="price">$20/mo</h3>
                    <input type="checkbox" class="otherpro" name="voip" id="voip" value="161">
                    <label for="voip"><p class="addtocart">Add</p></label>
                    <p class="detailsp four">Cut the cost but keep the landline. Don’t waste money buying cellphones for the kids. Keep a home phone and get unlimited long-distance as well. VoIP packages require an ATA which is included in the ReadyNet router provided by Safelink Internet, or can be rented separately for $9.95 per month. </p>
                </div> 
                <div>           
                    <h3 class="red">Fax plus VoIP</h3> 
                    <strong id="five" class="showdetails">Details</strong>
                    <h3 class="price">$50/mo</h3>
                    <input type="checkbox" class="otherpro"  name="fax" id="fax" value="171">
                    <label for="fax"><p class="addtocart">Add</p></label>
                    <p class="detailsp five">Add Fax to your VoIP for even greater functionality. Great for your home based business or sending documents to the office. VoIP packages require an ATA which is included in the ReadyNet router provided by Safelink Internet, or can be rented separately for $9.95 per month. Fax requires a $165 equipment purchase.</p>
                </div>
                <div>           
                    <h3 class="red">Guardian Enhanced</h3> 
                    <strong id="six" class="showdetails">Details</strong>
                    <h3 class="price">$12/mo</h3>
                    <input type="checkbox" class="otherpro"  name="guardian_enhanced" id="guardian_enhanced" value="153">
                    <label for="guardian_enhanced"><p class="addtocart">Add</p></label>
                    <p class="detailsp six">Take the same great features of Guardian, that are already included in your router, and use them on devices outside the home. Manager screen time, filter content, and track browsing history on your devices even if they leave the house, are on another Wi-Fi system, or try using cellphone data.</p>
                </div>
                <div>                
                    <h3 class="red">Guardian PLUS</h3>
                    <strong id="seven" class="showdetails">Details</strong>
                    <h3 class="price">$25/mo</h3>
                    <input type="checkbox" class="otherpro"  name="guardian_plus" id="guardian_plus" value="145">
                    <label for="guardian_plus"><p class="addtocart">Add</p></label>
                    <p class="detailsp seven">Bundle VoIP service and Guardian Plus for maximum control and versatility! Plus save $7 each month when compared to buying each service individually.</p>
                </div>       
            </div>
        </section>
        <section class="finalize product" id="finalize">
            <p class="buttonsubmit">
                <button type="button" id="btnstep1"class="sfsubmitbtn addtocart">CHECK OUT</button>
            </p>
        </section> 
    </div>
    <div class="popupbg">
        <div class="loader"></div>
        <div class="popupwrapper">
            <span class="closepopup">CLOSE</span>   
            <div class="popup">     
                <div class="orderheader" id="orderheader">
                    <h2>Shopping Cart</h2>
                </div>
                <table>
                    <thead>
                        <tr><th>Name</th><th>Price</th><tr>
                    </thead>
                    <tbody id="itemlist">
                    </tbody>
                    <tfoot><td><strong>Order Total:</strong></td><td><strong class="totalprice"></strong></td></tfoot>
                </table>
                <p class="notes"></p>
                <section class="basicdata">
                    <div class="shipping">
                        <strong>Installation Address</strong>
                        <div class="inputdata">
                            <input type="text" placeholder="First Name" class="inputbasic" id="fname" name="fname">
                            <input type="text" placeholder="Last Name" class="inputbasic" id="lname" name="lname">
                            <input type="text" placeholder="Address - Line 1" class="inputbasic" id="shippingaddress1" name="shippingaddress1">
                            <input type="text" placeholder="Address - Line 2" class="inputbasic" id="shippingaddress2" name="shippingaddress2">
                            <input type="text" placeholder="City" class="inputbasic" id="shippingcity" name="shippingcity">
                            <select id="shippingstate" class="inputbasic" name="shippingstate">
                                <option value="Idaho">Idaho</option>
                                <option value="Montana">Montana</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                            <input type="text" placeholder="Zip Code" class="inputbasic" id="shippingzip" name="shippingzip">
                            <input type="text" placeholder="Phone" class="inputbasic" id="phone" name="phone">
                            <input type="email" placeholder="E-mail" class="inputbasic" id="email" name="email">
                        </div>
                    </div>
                    <div class="billing">
                        <strong>Billing Address</strong>
                        <div class="inputdata">
                            <label for="same"><input type="checkbox" class="same" name="same" id="same" value="same"> Billing address is the same as installation</label>
                            <input type="text" placeholder="Address - Line 1" class="inputbasic" id="billingaddress1" name="billingaddress1">
                            <input type="text" placeholder="Address - Line 2" class="inputbasic" id="billingaddress2" name="billingaddress2">
                            <input type="text" placeholder="City" class="inputbasic" id="billingcity" name="billingcity">
                            <select id="billingstate" class="inputbasic" name="billingstate">
                                <option value="Idaho">Idaho</option>
                                <option value="Montana">Montana</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                            <input type="text" placeholder="Zip Code" class="inputbasic" id="billingzip" name="billingzip">
                        </div>
                    </div>
                </section>
                <section class="btnarea"></section>
            </div>
        </div>
    </div>
</form>
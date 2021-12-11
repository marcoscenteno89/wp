<?php  defined( 'ABSPATH' ) or die(); ?>

<div id="customer-form" class="red padding">
    <h1>BUILD YOUR PLAN</h1>
    <div class="tabs">
        <div class="steps flex"></div>
        <div class="tab validate">
            <h1>this section is for a calendar</h1>
        </div>
        <div class="tab accordion validate">
            <div class="head blue font-white block">Residential</div>
            <div class="residential body accordion">
                <div class="head gray font-white block">Wireless</div>
                <div class="wireless body">
                    <label class="savings residential" for="savings">
                        <span class="cell">Savings (5X1)</span><span class="cell">$35</span>
                        <input type="radio" class="package" name="packages" id="savings" value="95" data-discount="260">
                    </label>
                    <label class="streaming residential" for="streaming">
                        <input type="radio" class="package" name="packages" id="streaming" value="99" data-discount="217">
                        <div class="head"><span class="cell">Streaming (10X2)</span><span class="cell">$59</span></div>
                    </label>
                    <label class="family residential" for="family">
                        <input type="radio" class="package" name="packages" id="family" value="105" data-discount="219">
                        <div class="head"><span class="cell">Family (15X3)</span><span class="cell">$69</span></div>
                    </label>
                    <label class="tech residential" for="tech">
                        <input type="radio" class="package" name="packages" id="tech" value="113" data-discount="223">
                        <div class="head"><span class="cell">Tech (20X4)</span><span class="cell">$79</span></div>
                    </label>
                    <label class="power residential" for="power">
                        <input type="radio" class="package" name="packages" id="power" value="129" data-discount="225">
                        <div class="head"><span class="cell">Power (25X5)</span><span class="cell">$109</span></div>
                    </label>
                    <label class="extreme residential" for="extreme">
                        <input type="radio" class="package" name="packages" id="extreme" value="440" data-discount="442">
                        <div class="head"><span class="cell">Extreme (50X10)</span><span class="cell">$139</span></div>
                    </label>
                </div>
                <div class="head gray font-white block">Fiber</div>
                <div class="fiber body">
                    <label class="10x10 residential" for="50x50">
                        <input type="radio" class="package" name="packages" id="50x50" value="111" data-discount="250">
                        <div class="head"><span class="cell">Sonic 50</span><span class="cell">$59</span></div>
                    </label>
                    <label class="25x25 residential" for="100x100">
                        <input type="radio" class="package" name="packages" id="100x100" value="123" data-discount="252">
                        <div class="head"><span class="cell">Sonic 100</span><span class="cell">$74</span></div>
                    </label>
                    <label class="50x50 residential" for="150x150">
                        <input type="radio" class="package" name="packages" id="150x150" value="133" data-discount="225">
                        <div class="head"><span class="cell">Sonic 150</span><span class="cell">$99</span></div>
                    </label>
                    <label class="100x100 residential" for="500x500">
                        <input type="radio" class="package" name="packages" id="500x500" value="143" data-discount="256">
                        <div class="head"><span class="cell">Sonic 500</span><span class="cell">$149</span></div>
                    </label>
                    <label class="200x200 residential" for="1000x1000">
                        <input type="radio" class="package" name="packages" id="1000x1000" value="157" data-discount="158">
                        <div class="head"><span class="cell">Sonic 1000</span><span class="cell">$249</span></div>
                    </label>
                </div>
            </div>
            <div class="head blue font-white block">Commercial</div>
            <div class="commercial body accordion">
                <div class="head">Wireless</div>
                <div class="wireless body">
                    <label class="basicwireless commercial" for="basicwireless">
                        <input type="radio" class="package" name="packages" id="basicwireless" value="444" data-discount="">
                        <div class="head"><span class="cell">Wireless Basic (10X3)</span><span class="cell">$69</span></div>
                    </label>
                    <label class="entrepreneurwireless commercial" for="entrepreneurwireless">
                        <input type="radio" class="package" name="packages" id="entrepreneurwireless" value="173" data-discount="">
                        <div class="head"><span class="cell">Wireless Entrepreneur (15X4)</span><span class="cell">$89</span></div>
                    </label>
                    <label class="smallbusinesswireless commercial" for="smallbusinesswireless">
                        <input type="radio" class="package" name="packages" id="smallbusinesswireless" value="177" data-discount="">
                        <div class="head"><span class="cell">Wireless Small Biz (20X5)</span><span class="cell">$109</span></div>
                    </label>
                    <label class="largebusinesswireless commercial" for="largebusinesswireless">
                        <input type="radio" class="package" name="packages" id="largebusinesswireless" value="187" data-discount="">
                        <div class="head"><span class="cell">Wireless Large Biz (25X6)</span><span class="cell">$129</span></div>
                    </label>
                    <label class="corporatewireless commercial" for="corporatewireless">
                        <input type="radio" class="package" name="packages" id="corporatewireless" value="115" data-discount="">
                        <div class="head"><span class="cell">Wireless Corporate (50X10)</span><span class="cell">$169</span></div>
                    </label>
                </div>
                <div class="head">Fiber</div>
                <div class="fiber body">
                    <label class="entrepreneurfiber commercial" for="entrepreneurfiber">
                        <input type="radio" class="package" name="packages" id="entrepreneurfiber" value="119" data-discount="">
                        <div class="head"><span class="cell">Entrepreneur fiber (50)</span><span class="cell">$79</span></div>
                    </label>
                    <label class="smallbusinessfiber commercial" for="smallbusinessfiber">
                        <input type="radio" class="package" name="packages" id="smallbusinessfiber" value="125" data-discount="">
                        <div class="head"><span class="cell">Small Biz fiber (100)</span><span class="cell">$99</span></div>
                    </label>
                    <label class="largebusinessfiber commercial" for="largebusinessfiber">
                        <input type="radio" class="package" name="packages" id="largebusinessfiber" value="131" data-discount="">
                        <div class="head"><span class="cell">Large Biz fiber (150)</span><span class="cell">$124</span></div>
                    </label>
                    <label class="corporatefiber commercial" for="corporatefiber">
                        <input type="radio" class="package" name="packages" id="corporatefiber" value="139" data-discount="">
                        <div class="head"><span class="cell">Corporate fiber (500)</span><span class="cell">$199</span></div>
                    </label>
                    <label class="enterprisefiber commercial" for="enterprisefiber">
                        <input type="radio" class="package" name="packages" id="enterprisefiber" value="151" data-discount="">
                        <div class="head"><span class="cell">Enterprise fiber (1000)</span><span class="cell">$299</span></div>
                    </label>
                </div>
            </div>
        </div>
        <div class="tab validate">
            <h1>This section is for addons</h1>
        </div>
        <div class="tab validate">
            <h1>this section is for discounts</h1>
        </div>
        <div class="tab">
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
        </div>
    </div>
    <div class="status"></div>
    <div class="controller">
        <button type="button" data-value="-1" id="btn-prev">Previous</button>
        <button type="button" data-value="1" id="btn-next">Next</button>
        <button type="button" class="submit">Submit</button>
    </div>
</div>
<form id="customerform" class="hidden clientform">
    <div class="contact">
        <input type="email" placeholder="E-mail" class="inputbasic" id="email" name="email">
        <input type="text" placeholder="First Name" class="inputbasic" id="fname" name="fname">
        <input type="text" placeholder="Last Name" class="inputbasic" id="lname" name="lname">
        <input type="text" placeholder="Phone" class="inputbasic" id="phone" name="phone">
        
        <select id="productline" class="inputbasic" name="productline" required>
            <option value="">Residential or Commercial Use?</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
        </select>
        <input type="text" placeholder="Address - Line 1" class="inputbasic" id="address1" name="address1">
        <input type="text" placeholder="Address - Line 2" class="inputbasic" id="address2" name="address2">
        <input type="text" placeholder="Zip Code" pattern="[0-9]" maxlength="5" class="inputbasic" id="zip" name="zip">
        <input type="text" placeholder="City" class="inputbasic" id="city" name="city">
        <select id="state" class="inputbasic" name="state">
            <option value="Idaho" selected="selected">Idaho</option>
            <option value="Montana">Montana</option>
            <option value="Oregon">Oregon</option>
            <option value="Wyoming">Wyoming</option>
        </select>
        <select id="campaign" name="campaign" class="inputbasic">
            <option value="">How did you hear about us?</option>
            <option value="28">Affiliate</option>
            <option value="64">Brochure</option>
            <option value="360">Chat</option>
            <option value="9">Direct Mail</option>
            <option value="50">Door Hanger</option>
            <option value="48">Door-to-Door sales</option>
            <option value="358">Email</option>
            <option value="52">Employee Account</option>
            <option value="56">Existing Customer Adding Acct.</option>
            <option value="54">Existing Equipment</option>
            <option value="58">Installer Sale</option>
            <option value="60">Mobile Phone Ads</option>
            <option value="62">Newspaper</option>
            <option value="12">Online - Pay Per Click</option>
            <option value="11">Online - Organic Engine</option>
            <option value="362">Online - Social Media</option>
            <option value="98">Other</option>
            <option value="66">Outdoor-billboard</option>
            <option value="68">Outdoor-truck wrap</option>
            <option value="70">Radio</option>
            <option value="72">Radio-Spanish</option>
            <option value="7">Referral - From Affiliate/Partner</option>
            <option value="8">Referral - From Customer</option>
            <option value="76">Referral-Competitor</option>
            <option value="78">Referral-Employee</option>
            <option value="80">Returning Customer</option>
            <option value="86">Street/Yard sign</option>
            <option value="90">Television</option>
            <option value="88">Theater</option>
            <option value="92">Trade Account (tower, etc.)</option>
            <option value="13">Trade Show/Events </option>
            <option value="94">Walk-in</option>
            <option value="19">Website</option>
            <option value="10">Yellow Pages</option>
        </select>
        <input type="text" placeholder="Promo Code" class="inputbasic" id="promovalue" name="promovalue">
        <input class="inputbasic" id="other" name="other" placeholder="Other" type="text" />
        <input class="inputbasic" id="referredby" name="referredby" placeholder="Referred By" type="text">
        <input class="inputbasic" id="currentprovider" name="currentprovider" placeholder="Current Provider" type="text">
        <input class="inputbasic" id="switchingproviderreason" name="switchingproviderreason" placeholder="Why Are You Switching Provider?" type="text">
        <select id="stage" name="stage" class="inputbasic">
            <option value="">Sales Stage</option>
            <option value="5" selected="selected">Working</option>
            <option value="8">Holding</option>
            <option value="100">Sold - EI</option>
            <option value="98">Sold - MV</option>
            <option value="96">Sold - TV</option>
            <option value="102">Sold - WY</option>
            <option value="35">Lost to Competitor</option>
            <option value="33">No Coverage w/safelink</option>
            <option value="76">No Coverage w/ any provider</option>
            <option value="0">Oportunity Already Exists</option>
        </select>
        <input type="text" placeholder="Company Name" class="inputbasic commercial" id="companyname" name="companyname">
        <input type="text" placeholder="Assistant Name" class="inputbasic commercial" id="assistantname" name="assistantname">
        <input type="text" placeholder="Assistant Phone" class="inputbasic commercial" id="assistantphone" name="assistantphone">
        <input type="text" placeholder="Assistant E-mail" class="inputbasic commercial" id="assistantemail" name="assistantemail">
        <input type="text" class="inputbasic" id="salesrep" name="salesrep">
        <div class="notes">
            <textarea class="inputbasic" name="salesnotes" id="salesnotes" cols="30" rows="5" placeholder="Sales Notes"></textarea> 
            <?php wp_editor( '' , 'dispatchnotes', $settings = array('textarea_name' => 'dispatchnotes') ); ?>
        </div>       
    </div>
    <div class="products">
        <div class="packages section">       
            <label class="savings residential" for="savings">
                <input type="radio" class="package" name="packages" id="savings" value="95" data-discount="260"> 
                <div class="head"><span class="cell">Savings (5X1)</span><span class="cell">$35</span></div>
            </label>
            <label class="streaming residential" for="streaming">
                <input type="radio" class="package" name="packages" id="streaming" value="99" data-discount="217">
                <div class="head"><span class="cell">Streaming (10X2)</span><span class="cell">$59</span></div>
            </label>              
            <label class="family residential" for="family">
                <input type="radio" class="package" name="packages" id="family" value="105" data-discount="219">
                <div class="head"><span class="cell">Family (15X3)</span><span class="cell">$69</span></div>
            </label> 
            <label class="tech residential" for="tech">
                <input type="radio" class="package" name="packages" id="tech" value="113" data-discount="223">
                <div class="head"><span class="cell">Tech (20X4)</span><span class="cell">$79</span></div>
            </label>
            <label class="power residential" for="power">
                <input type="radio" class="package" name="packages" id="power" value="129" data-discount="225">
                <div class="head"><span class="cell">Power (25X5)</span><span class="cell">$109</span></div>
            </label>
            <label class="extreme residential" for="extreme">
                <input type="radio" class="package" name="packages" id="extreme" value="440" data-discount="442">
                <div class="head"><span class="cell">Extreme (50X10)</span><span class="cell">$139</span></div>
            </label>
            <label class="10x10 residential" for="50x50">
                <input type="radio" class="package" name="packages" id="50x50" value="111" data-discount="250">
                <div class="head"><span class="cell">Sonic 50</span><span class="cell">$59</span></div>
            </label>
            <label class="25x25 residential" for="100x100">
                <input type="radio" class="package" name="packages" id="100x100" value="123" data-discount="252">
                <div class="head"><span class="cell">Sonic 100</span><span class="cell">$74</span></div>
            </label>                
            <label class="50x50 residential" for="150x150">
                <input type="radio" class="package" name="packages" id="150x150" value="133" data-discount="225">
                <div class="head"><span class="cell">Sonic 150</span><span class="cell">$99</span></div>
            </label>
            <label class="100x100 residential" for="500x500">
                <input type="radio" class="package" name="packages" id="500x500" value="143" data-discount="256">
                <div class="head"><span class="cell">Sonic 500</span><span class="cell">$149</span></div>
            </label>
            <label class="200x200 residential" for="1000x1000">
                <input type="radio" class="package" name="packages" id="1000x1000" value="157" data-discount="158">
                <div class="head"><span class="cell">Sonic 1000</span><span class="cell">$249</span></div>
            </label>
            <label class="entrepreneurfiber commercial" for="entrepreneurfiber">
                <input type="radio" class="package" name="packages" id="entrepreneurfiber" value="119" data-discount="">
                <div class="head"><span class="cell">Entrepreneur fiber (50)</span><span class="cell">$79</span></div>
            </label>
            <label class="smallbusinessfiber commercial" for="smallbusinessfiber">
                <input type="radio" class="package" name="packages" id="smallbusinessfiber" value="125" data-discount="">
                <div class="head"><span class="cell">Small Biz fiber (100)</span><span class="cell">$99</span></div>
            </label>
            <label class="largebusinessfiber commercial" for="largebusinessfiber">
                <input type="radio" class="package" name="packages" id="largebusinessfiber" value="131" data-discount="">
                <div class="head"><span class="cell">Large Biz fiber (150)</span><span class="cell">$124</span></div>
            </label>
            <label class="corporatefiber commercial" for="corporatefiber">
                <input type="radio" class="package" name="packages" id="corporatefiber" value="139" data-discount="">
                <div class="head"><span class="cell">Corporate fiber (500)</span><span class="cell">$199</span></div>
            </label>
            <label class="enterprisefiber commercial" for="enterprisefiber">
                <input type="radio" class="package" name="packages" id="enterprisefiber" value="151" data-discount="">
                <div class="head"><span class="cell">Enterprise fiber (1000)</span><span class="cell">$299</span></div>
            </label>
			<label class="basicwireless commercial" for="basicwireless">
                <input type="radio" class="package" name="packages" id="basicwireless" value="444" data-discount="">
                <div class="head"><span class="cell">Wireless Basic (10X3)</span><span class="cell">$69</span></div>          
            </label>
            <label class="entrepreneurwireless commercial" for="entrepreneurwireless">
                <input type="radio" class="package" name="packages" id="entrepreneurwireless" value="173" data-discount="">
                <div class="head"><span class="cell">Wireless Entrepreneur (15X4)</span><span class="cell">$89</span></div>          
            </label>
            <label class="smallbusinesswireless commercial" for="smallbusinesswireless">
                <input type="radio" class="package" name="packages" id="smallbusinesswireless" value="177" data-discount="">
                <div class="head"><span class="cell">Wireless Small Biz (20X5)</span><span class="cell">$109</span></div>
            </label>
            <label class="largebusinesswireless commercial" for="largebusinesswireless">
                <input type="radio" class="package" name="packages" id="largebusinesswireless" value="187" data-discount="">
                <div class="head"><span class="cell">Wireless Large Biz (25X6)</span><span class="cell">$129</span></div>
            </label>
            <label class="corporatewireless commercial" for="corporatewireless">
                <input type="radio" class="package" name="packages" id="corporatewireless" value="115" data-discount="">
                <div class="head"><span class="cell">Wireless Corporate (50X10)</span><span class="cell">$169</span></div>
            </label>
        </div>
        <div class="extra section">       
            <div class="discounts">
                <h1>Discounts</h1>
                <!-- ADD RESIDENTIAL DISCOUNTS HERE -->
                <label for="contract" class="residential"><input type="checkbox" class="disc" name="contract" id="contract" value="203"> 1 Year Contract<strong> -$65 </strong></label>                      
                <label for="autopay" class="residential"><input type="checkbox" class="disc" name="autopay" id="autopay" value="207">Auto-Pay<strong> -$25 </strong></label>                  
                <label for="military" class="residential"><input type="checkbox" class="disc" name="military" id="military" value="237">Military Discount<strong> -$5.50 </strong></label>                
                <!-- <label for="employee_discount" class="residential"><input type="checkbox" class="disc" name="employee_discount" id="employee_discount" value="true">Employee Discount <strong>No payment due</strong></label> -->
                <label for="free_month" class="residential"><input type="radio" class="disc" name="main_promo" id="free_month" value="true">Free Month <strong>No payment due</strong></label>                   
                <label for="tenforsix" class="residential"><input type="radio" class="disc" name="main_promo" id="tenforsix" value="432">Save 10 for 6 months <strong>-$10</strong></label>
                <!-- ADD COMMERCIAL DISCOUNTS HERE -->                               
                <label for="1year_contract_business" class="commercial"><input type="checkbox" class="disc" name="1year_contract_business" id="1year_contract_business" value="248">1 Year Contract<strong> -$99.95 </strong></label>
                <label for="2year_contract_business" class="commercial"><input type="checkbox" class="disc" name="2year_contract_business" id="2year_contract_business" value="244">2 Year Contract <strong> -$199.95</strong></label>                
                <!-- <label for="military"><input type="checkbox" class="disc commercial" name="military" id="military" value="237">Military Discount<strong> -$5.50 </strong></label>                   -->
            </div>
            <div class="other">
                <h1>Other Products</h1> 
                <!-- ADD RESIDENTIAL EXTRA PRODUCTS HERE -->
                <label for="voip" class="residential"><input type="checkbox" class="otherpro" name="voip" id="voip" value="161">VoIP Phone<strong>$20/mo </strong></label>                   
                <label for="fax" class="residential"><input type="checkbox" class="otherpro"  name="fax" id="fax" value="171">VoIP - Residential Fax<strong> $30/mo </strong></label>
                <label for="ata_residential" class="residential"><input type="checkbox" class="otherpro"  name="ata_residential" id="ata_residential" value="436" readonly >Fax ATA <strong> $179 </strong></label>               
                <label for="guardian_enhanced" class="residential"><input type="checkbox" class="otherpro"  name="guardian_enhanced" id="guardian_enhanced" value="153">Guardian Enhanced <strong> $5/mo </strong></label>                         
                <label for="guardian_plus" class="residential"><input type="checkbox" class="otherpro"  name="guardian_plus" id="guardian_plus" value="145">Guardian PLUS <strong> $25/mo </strong></label>  
                <!-- ADD COMMERCIAL EXTRA PRODUCTS HERE -->                                     
                <label for="pointtopoint" class="commercial"><input type="checkbox" class="otherpro"  name="pointtopoint" id="pointtopoint" value="434">Point to Point(new service) <strong> $5/radio/mo </strong></label>                 
                <label for="guardian_business" class="commercial"><input type="checkbox" class="otherpro"  name="guardian_business" id="guardian_business" value="109">Guardian Business <strong> $20/mo </strong></label>                        
                <label for="additional_ip" class="commercial"><input type="checkbox" class="otherpro"  name="additional_ip" id="additional_ip" value="117">Additional IP <strong> $5/mo </strong></label>
                <label for="voip_business" class="commercial"><input type="checkbox" class="otherpro" name="voip_business" id="voip_business" value="127">VoIP Phone Business <strong>$25/mo</strong></label>                   
                <label for="fax_business" class="commercial"><input type="checkbox" class="otherpro"  name="fax_business" id="fax_business" value="137">VoIP - Commercial Fax <strong> $30/mo </strong></label>
                <label for="ata_commercial" class="commercial"><input type="checkbox" class="otherpro"  name="ata_commercial" id="ata_commercial" value="436">Fax ATA <strong> $179 </strong></label>         
            </div>                        
        </div>
    </div>
    <div id="status" class="status section">
        <label for="phonecall" class="btn"><input type="checkbox" class="inputbasic" id="phonecall" name="phonecall" value="268" style="margin:0 !important;"> Phone Call</label>
        <button type="button" class="btn" id="renewtoken">Renew Token</button>
        <button type="button" id="submit"class="sfsubmitbtn addtocart btn">Submit</button>
        <button type="button" class="btn reset">Clear</button>
        <button type="button" class="btn" id="schedulebtn">Schedule</button>
    </div>
</form>
<section id="background" class="padding flex hidden"></section>
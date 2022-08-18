<form action="" class="request-coverage">
    <div class="tabs">
        <div class="tab validate">
            <h3>Congrats!</h3> 
            <h4>You're in the coverage area!</h4>
            <p><hr></p>
            <h5>Please provide some more details about yourself</h5>
            <input type="hidden" class="form-input" name="tags" placeholder="tags" value="632,335">
            <input required type="text" class="form-input" name="given_name" placeholder="First Name">
            <input required type="text" class="form-input" name="family_name" placeholder="Last Name">
            <input required type="email" class="form-input" name="email" placeholder="Email">
            <label for="productline"><input type="checkbox" name="productline"> Is this a Business</label>
            <p>Provide an email address so you can stay informed of the progress.</p>
            <input name="business_name" class="business_name" type="text" placeholder="Business Name" required>
        </div>
        <div class="tab validate">
            <h3>What plan are you most insterested?</h3>
            <hr>
            <p>No obligation. You are only showing interest.</p>

            <label for="sonic_50"><input class="sonic_50" value="sonic_50" name="plan" type="radio" required> Sonic 50 - $59/Mo*</label>
            <label for="sonic_100"><input class="sonic_100" value="sonic_100" name="plan" type="radio"> Sonic 100 - $74/Mo*</label>
            <label for="sonic_150"><input class="sonic_150" value="sonic_150" name="plan" type="radio"> Sonic 150 - $99/Mo*</label>
            <label for="sonic_500"><input class="sonic_500" value="sonic_500" name="plan" type="radio"> Sonic 500 - $149/Mo*</label>
            <label for="sonic_1000"><input class="sonic_1000" value="sonic_1000" name="plan" type="radio"> Sonic 1000 - $249/Mo*</label>

            <label for="entrepreneur"><input class="entrepreneur" value="entrepreneur" name="plan" type="radio" required> Entrepreneur Fiber (50X50 Mbps) - $79/Mo*</label>
            <label for="small_biz"><input class="small_biz" value="small_biz" name="plan" type="radio"> Small Biz Fiber (100X100 Mbps) - $99/Mo*</label>
            <label for="large_biz"><input class="large_biz" value="large_biz" name="plan" type="radio"> Large Biz Fiber (150X150 Mbps) - $124/Mo*</label>
            <label for="corporate"><input class="corporate" value="corporate" name="plan" type="radio"> Corporate Fiber (500X500 Mbps) - $199/Mo*</label>
            <label for="enterprise"><input class="enterprise" value="enterprise" name="plan" type="radio"> Enterprise Fiber (1000X1000 Mbps) - $299/Mo*</label>
        </div>
        <div class="tab validate">
            <h3>Pledge your commitment</h3>
            <p>Before construction can begin, we need to know that 70% of residents are committed to the project and agree to pay the initial construction fee.</p>
            <hr>
            <h5>I agree to pay in one of the following methods.</h5>
            <label for="c1500"><input class="c1500" value="c1500" name="payment_option" type="radio" required> $1,500 paid immediately, when construction begins. </label>
            <label for="c2000"><input class="c2000" value="c2000" name="payment_option" type="radio"> $2,000 due at the time my home or business is available to be connected. </label>
            <label for="c24-month"><input class="c24-month" value="c24-month" name="payment_option" type="radio"> $95.83/mo for 24 months, financed with Safelink Internet. </label>
            <label for="cnone"><input class="cnone" value="cnone" name="payment_option" type="radio"> I don’t want a connection. I acknowledge that if I want connected later it will cost $3,000 to have someone come back out.</label>

            <label for="r1000"><input class="r1000" value="r1000" name="payment_option" type="radio" required> $1,000 due at the time my home or business is ready to be connected</label>
            <label for="r800"><input class="r800" value="r800" name="payment_option" type="radio"> $800 paid immediatly, when construction begins</label>
            <label for="r12-month"><input class="r12-month" value="r12-month" name="payment_option" type="radio"> $86.53/mo for 12 months, financed with Elko Federal Credit Union</label>
            <label for="r24-month"><input class="r24-month" value="r24-month" name="payment_option" type="radio"> $47.90/mo for 24 months, financed with Safelink Internet</label>
            <label for="rnone"><input class="rnone" value="rnone" name="payment_option" type="radio"> I don't want a connection. I acknowledge that if i want connected later it will be a $1,500 connection fee.</label>
        </div>
        <div class="controller fullwidth">
            <div class="status"></div>
            <button name="next" class="btn btnb w-100 red font-white">Continue</button>
            <button name="prev" class="btn btnb w-100 red font-white">Previous</button>
        </div>
    </div>
</form>
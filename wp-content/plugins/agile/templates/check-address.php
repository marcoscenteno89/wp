<!-- 
  IdahoOrganization = 1
  IdahoProjectId = v%3A33
  NevadaOrganization = 5
  NevadaProjectId = v%3A58
-->
<form action="/sales-entry" class="agile-form check-address" id="verify-address">
<div class="tabs">
  <div class="steps"></div>
  <div class="tab" data-name="Check Address">
    <input type="hidden" class="form-input" name="lat">
    <input type="hidden" class="form-input" name="lng">
    <input type="hidden" class="form-input" name="o" value="<?php echo $atts['o']; ?>">
    <input type="hidden" class="form-input" name="project_id" value="<?php echo $atts['project_id']; ?>">
    <input required type="text" class="form-input" name="line1" placeholder="Address">
    <input type="text" class="form-input" name="line2" placeholder="Address Line 2">
    <input required type="text" class="form-input" name="locality" placeholder="City">
    <input required type="text" class="form-input" name="region" placeholder="State">
    <input required type="text" class="form-input" name="postal_code" placeholder="Zip Code">
  </div>
  <div class="controller">
    <div class="status"></div>
    <div class="group">
      <button 
        name="next" 
        type="button" 
        class="btn"
        data-limit-id="check_address" 
        data-limit-count="5"
        data-limit-min="5"
        data-limit-hr="0"
        data-limit-day="0"
      >Check Now</button>
    </div>
  </div>
</div>
</form>
<div class="row">
  <form action="" class="agile-form check-wo" style="padding:0 !important;">
    <div class="tabs">
      <div class="steps"></div>
      <div class="tab" data-name="Check Work Order Status">
        <input type="hidden" class="form-input" name="o" value="<?php echo $atts['o']; ?>">
        <input 
          type="hidden" 
          class="form-input" 
          name="project_id" 
          value="<?php echo $atts['project_id']; ?>">
        <input 
          required 
          type="number" 
          class="form-input" 
          name="workorder_id" 
          placeholder="Work Order #">
      </div>
      <div class="controller">
        <div class="status"></div>
        <div class="group">
          <button 
            name="next" 
            type="button"
            class="btn"
            data-limit-id="check_wo" 
            data-limit-count="5"
            data-limit-min="30"
            data-limit-hr="0"
            data-limit-day="0"
          >Check Now</button>
        </div>
      </div>
    </div>
  </form>
  <div class="col-8 check-wo-container"></div>
</div>
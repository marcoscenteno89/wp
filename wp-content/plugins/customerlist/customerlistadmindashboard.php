<?php
global $wpdb;
$sql = 'SELECT * FROM northwes_Customers.customers ';
$customers = $wpdb->get_results($sql);
?>
<script>
 var customers = [];
</script>
<div id="map"></div>
<div class="cst">
    <input type="checkbox" id="towers" class="towers" name="towers" value="towers">Towers
    <input type="checkbox" id="fiberring" class="fiberring" name="fiberring" value="fiberring">Fiber Ring <br> <br>
    <input type='radio' name='ctm' class="cstdisplay" id="customers" value='customers'>Customers
    <input type='radio' name='ctm' class="cstdisplay" id="leads" value='leads'>Leads
    <input type='radio' name='ctm' class="cstdisplay" id="keyword" value="keyword">Keyword
    <input type='radio' name='ctm' class="cstdisplay" id="all" value='all'>All<br>
</div>
<div class="ctmhidden hidden">
    <input type="checkbox" id="customers_active" class="customers" name="customers" value="customers_active">Active Customers <br>
    <input type="checkbox" id="customers_nonactive" class="customers" name="customers" value="customers_nonactive">Non Active Customers
</div>
<div class="leadshidden hidden">
    <input type="checkbox" id="leads" class="leads" name="leads" value="leads_leads">Leads <br>
    <input type="checkbox" id="leads" class="leads" name="leads" value="leads_wonoshot">WO No-Shot <br>
    <input type="checkbox" id="leads" class="leads" name="leads" value="leads_wocancelled">WO Cancelled <br>
    <input type="checkbox" id="leads" class="leads" name="leads" value="leads_womaxap">WO Max-AP <br>
    <input type="checkbox" id="leads" class="leads" name="leads" value="leads_wolosttocompetitor">WO Lost to Competitor <br>
</div>
<div class="keywordhidden hidden">
<input type="text" name="keys" id="keys" class="keys">
</div>
<div><br><button class="update" id="update" >Update</update></div>
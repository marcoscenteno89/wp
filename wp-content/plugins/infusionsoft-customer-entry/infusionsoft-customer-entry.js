document.addEventListener("DOMContentLoaded", function() {
    var closepopup = document.querySelector('.closepopup');
    var popupbg = document.querySelector('.popupbg');
    closepopup.addEventListener('click', function() { popupbg.style.display = 'none'; });
    var events = ['input'];
    var btnstep1 = document.querySelector('#btnstep1');
    btnstep1.addEventListener("click", cst_order_get_data, false);
    var datavalue = document.querySelectorAll('.package, .disc, .otherpro'); //FRONT END ANIMATION START
    for ( let i = 0; i < datavalue.length; i++ ) { for (event of events ) { datavalue[i].addEventListener(event, cst_order_assign_values); } } 
    function cst_order_get_data() { // Get Customer's Purchased Products
        var inputdata = document.querySelectorAll('#customerform .product input');
        data = infusionsoft_customer_entry_collectdata(inputdata);
        if (data.customer.packageselected == false) {
            alert("Please Pick a Package");
        } else {
            data.productsonly = true;
            infusionsoft_customer_entry_api(data).then( function(data) {
                console.log(data);
                var btnarea = document.querySelector('.btnarea');            
                var totalprice = document.querySelector('.totalprice');
                var same = document.querySelector('#same');            
                same.addEventListener('change', setbilling);
                var total = 0;
                var itemlist = document.querySelector('#itemlist');
                    itemlist.innerHTML = '';
                for ( let i = 0; i < data.length; i++ ) {
                    var title = document.createElement("tr");
                    var content;
                    if (data[i].product_price < 0){
                        content = '<td><strong>'+data[i].product_name+'</strong><p>'+data[i].product_short_desc+'</p></td><td class="redfont">$'+data[i].product_price+'</td>';
                    } else {
                        content = '<td><strong>'+data[i].product_name+'</strong><p>'+data[i].product_short_desc+'</p></td><td>$'+data[i].product_price+'</td>';
                    }                
                    itemlist.appendChild(title);
                    title.innerHTML = content;
                    total = total + data[i].product_price;
                }
                totalprice.innerHTML = '$'+parseFloat(total).toFixed(2);
                btnarea.innerHTML = '<button type="button" id="submit" class="btn">PLACE ORDER</button><button type="button" id="reset" class="btn">EDIT CART</button> ';
                var submit = document.querySelector('#submit');
                var reset = document.querySelector('#reset');
                reset.addEventListener('click', function() { popupbg.style.display = 'none'; });
                submit.addEventListener('click', function() { 
                    data.productsonly = false;
                    var inputdata = document.querySelectorAll('#customerform .inputbasic, #customerform .product input');
                    data = infusionsoft_customer_entry_collectdata(inputdata);
                    data.productsonly = false;
                    infusionsoft_customer_entry_api(data).then( function(data) {
                        console.log(data);
                        var btnarea = document.querySelector('.btnarea');
                        var billing;
                        var shipping;
                        for (let i = 0; i < data.addresses.length; i++) { 
                            if (data.addresses[i].field == 'BILLING') {
                                billing = data.addresses[i];
                            } else {
                                shipping = data.addresses[i];
                            }
                        }
                        var header = document.querySelector('#orderheader');
                        var shippingaddress = document.querySelector('.shipping .inputdata');
                        var billingaddress = document.querySelector('.billing .inputdata');                   
                        var notes = document.querySelector('.notes');
                        header.innerHTML = '<h2>Thank You for Your Order. A customer service rep will contact you to confirm an installation date.</h2> <h2>Order Summary</h2>';
                        shippingaddress.innerHTML = `${data.given_name} ${data.family_name}<br>${shipping.line1} ${shipping.line2}<br>${shipping.locality}, ${shipping.region} ${shipping.zip_code}`;
                        billingaddress.innerHTML = `${data.given_name} ${data.family_name}<br>${billing.line1} ${billing.line2}<br>${billing.locality}, ${billing.region} ${billing.zip_code}`;
                        btnarea.innerHTML = `<button type="button" id="finished" class="btn">FINISHED</button><button type="button" id="print" class="btn">PRINT THIS PAGE</button>`;
                        notes.innerHTML = 'First payment will be due at the time of the installation.';
                        var finish = document.querySelector('#finished');
                        var print = document.querySelector('#print');
                        finish.addEventListener('click', function(){ location.reload(); });
                        print.addEventListener('click', function(){ window.print(); });
                    });
                });
            })
            .catch(function(error) {
                console.log(error);
            });
        }        
    }
    progressbar();
    activelement();
});
//FUNCTIONS
function infusionsoft_customer_entry_api(data) {
    console.log(data);
    var popupbg = document.querySelector('.popupbg');
    var loader = document.querySelector('.loader');
    var popup = document.querySelector('.popupwrapper');
    popupbg.style.display = 'flex';
    loader.style.display = 'block';
    popup.style.display = 'none';
    return fetch(infusionsoft_customer_entry_api_ajax.ajax_url, { //Send Gathered data to InfusionSoft
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' }),
        body: 'action=infusionsoft_customer_entry_api&data=' + JSON.stringify(data)
    }).then(function(res) { 
        loader.style.display = 'none';
        popup.style.display = 'flex';
        return res.json();
    });
}
function infusionsoft_customer_entry_collectdata(inputdata) {
    var data = {};
    var packages;
    var fees = ['205', '239', '241', '242'];
    data.products = [];
    data.customer = {};
    data.customer.packageselected = false;
    for ( let i = 0; i < inputdata.length; i++ ) { 
        if (inputdata[i].type == 'checkbox') {
            if (inputdata[i].checked) { data.products.push(inputdata[i].value); }
        } else if (inputdata[i].type == 'radio') {
            if (inputdata[i].checked) {
                data.products.push(inputdata[i].value);
                packages = inputdata[i].value;
                data.freepackage = inputdata[i].getAttribute('data-discount');
                data.customer.packageselected = true;
            }
        } else {
            data.customer[inputdata[i].name] = inputdata[i].value;
        }
    }
    for (let i = 0; i < fees.length; i++) {    data.products.push(fees[i]);    }
    if ( data.customer.promovalue != '' ) {
        var promo = getpromo(data);
        for (let i = 0; i < promo.length; i++) {    data.products.push(promo[i]);    }
    }
    data.products = Array.from( new Set( data.products ) );

    return data;
}
function cst_order_assign_values() {
    var addtocartbtn = document.querySelectorAll('.packageslist .addtocart');
    if (this.type == 'checkbox') {
        if ( this.checked ) {
            this.nextElementSibling.lastElementChild.innerHTML = 'Remove';
        } else {
            this.nextElementSibling.lastElementChild.innerHTML = 'Add';
        }
    } else {
        for ( var i = 0; i < addtocartbtn.length; i++ ) {  addtocartbtn[i].innerHTML = 'Select';    }
        if ( this.id === this.id ) {
            this.nextElementSibling.lastElementChild.innerHTML = 'Selected';
        }
    }   
} //FRONT END ANIMATION END
function activelement() {
    var clicked = document.querySelectorAll('.top h3, .showdetails');
    for ( let i = 0; i < clicked.length; i++ ) {
        clicked[i].addEventListener("click", cst_order_select_active);
    }
    function cst_order_select_active() {
        var all = document.querySelectorAll('[name=displaylist], .detailsp');
        var selectedp = document.querySelectorAll('.bottom > div, .detailsp');
        for ( let i = 0; i < all.length; i++ ) {    all[i].classList.remove('active');    }
        for ( let i = 0; i < selectedp.length; i++ ) {
            if ( selectedp[i].classList.contains(this.id) == true ) {
                this.classList.add('active');
                selectedp[i].classList.add('active');
            }
        }     
    }
    var readyordertop  = document.querySelector('.readyorder .innerblock .top');
    var readyorderbottom  = document.querySelector('.readyorder .innerblock .bottom');
    readyordertop.addEventListener('click', function() {
        if (readyorderbottom.style.display == 'block') {    readyorderbottom.style.display = 'none';    } else {    readyorderbottom.style.display = 'block';    } 
    }); 
}
function progressbar() {
    var packagelist = document.querySelectorAll('.product');
    var progressbar = document.querySelectorAll('.progressbar > a > li');
    window.addEventListener( 'scroll', function() {
        for ( let i = 0; i < progressbar.length; i++ ) { progressbar[i].classList.remove('active'); }
        for ( let i = 0; i < packagelist.length; i++ ) {
            if (gambitGalleryIsInView( packagelist[i] ) == true ) {  
                progressbar[i].classList.add('active');
            }
        }
    });
    var gambitGalleryIsInView = function(el) {
        var scroll = window.scrollY || window.pageYOffset;
        var boundsTop = el.getBoundingClientRect().top + scroll;    
        var thirtypercent = el.clientHeight * 0.33;
        var viewport = { top: scroll + thirtypercent,  bottom: (scroll + window.innerHeight) - thirtypercent, };        
        var bounds = {  top: boundsTop + thirtypercent,  bottom: (boundsTop + el.clientHeight) - thirtypercent, };
        return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) || ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
    };
    document.querySelector('.progressbarcontainer').style.top = document.querySelector("header:first-of-type").clientHeight + 'px';
}
function setbilling() {
    if (same.checked == true) {  
        document.getElementById('billingaddress1').value = document.getElementById('shippingaddress1').value;
        document.getElementById('billingaddress2').value = document.getElementById('shippingaddress2').value;   
        document.getElementById('billingcity').value = document.getElementById('shippingcity').value;   
        document.getElementById('billingstate').value = document.getElementById('shippingstate').value;   
        document.getElementById('billingzip').value = document.getElementById('shippingzip').value;   
    } else {  
        document.getElementById('billingaddress1').value = '';
        document.getElementById('billingaddress2').value = '';      
        document.getElementById('billingcity').value = '';   
        document.getElementById('billingstate').value = '';   
        document.getElementById('billingzip').value = '';    
    }  
}
function getpromo(data) {
    var promolist = [];
    if ( data.customer.promovalue == 'neighbor30' || data.customer.promovalue == 'westmailer' || data.customer.promovalue == 'west18' || data.customer.promovalue == 'upgrade18' ) {
        promolist = [ '203', '207' ];//FREE INSTALLATION
    } else if (data.customer.promovalue == 'save30' || data.customer.promovalue == 'doorhanger18' || data.customer.promovalue == 'neighbor30' || data.customer.promovalue == 'neighbor' || data.customer.promovalue == '30mailer' || data.customer.promovalue == 'save19' ){ 
        promolist = [ '264', '266', data.freepackage ]; // FREE MONTH
    } else if (data.customer.promovalue == 'fiberme' ) {
        promolist = [ '264' ]; //SAVE 10
    } else if (data.customer.promovalue == 'freetrial' ) { 
        promolist = [ '203', '207', '264', '266', data.freepackage ];//FIRST MONTH FREE
    } else  {
        promolist = [];
    }
    return promolist;
}
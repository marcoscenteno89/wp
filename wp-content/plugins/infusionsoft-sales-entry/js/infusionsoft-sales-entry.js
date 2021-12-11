document.addEventListener("DOMContentLoaded", function() {

    var submit = document.querySelector('#submit');
    var productline = document.querySelector('#productline');
    var reset = document.querySelector('.reset');
    var schedulebtn = document.querySelector('#schedulebtn');
    var schedulepopup = document.querySelector('#schedulepopup');
    var schedulecontent = document.querySelector('#schedulecontent');
    var close = document.querySelectorAll('.close');
    var schedulesubmit = document.querySelector('#schedulesubmit');
    var backgroundcover = document.querySelector('.backgroundcover');
    var agilelogin = document.querySelector('.agilelogin');
    var submitagiletoken = document.querySelector('#getagiletoken');
    var renewtoken = document.querySelector('#renewtoken');
    var loader = document.querySelector('#loader');
    var email = document.querySelector('#email');
    var zip = document.querySelector('#zip');
    var popupitem = document.querySelectorAll('.popupitem');
    var fax = document.querySelector('#fax');
    var faxcom = document.querySelector('#fax_business');
    var ata = document.querySelector('#ata_residential');
    var atacom = document.querySelector('#ata_commercial');
    var status = document.querySelector('#status');
    var wo_type = document.querySelector('#type_id');
    var accountlist = document.querySelector('#accountlist');
    var accountlistcontainer = document.querySelector('.accountlistcontainer');
    var packagelist =  document.querySelectorAll('.packages > label');
    var agileurl = 'https://www.agileisp.com/api/';
    //var agileurl = 'http://127.0.0.1:8000/api/';
    const cst = {};
    cst.contact = {};
    cst.address = {};
    cst.settings = {};
    cst.ids = {};
    const data = {};
    cst.settings.create_account = false;
    verifytoken();
    addpackagecontent(packagelist);
    // calendar('#calendar');
    function verifyinfusionsoftuser() {
        data.verifyuser = sessionStorage.getItem('agileuser');
        let api = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' },
            body: 'action=infusionsoft_sales_entry_api&data=' + JSON.stringify(data),
            method: 'POST',
            url: infusionsoft_sales_entry_api_ajax.ajax_url
        }
        apicall(api).then(function (res) {
            if (res.valid_user === false) document.getElementById("salesrep").disabled = true;
        });
        for (const prop of Object.getOwnPropertyNames(data))  delete data[prop];
    }
    function cst_order_get_data() { // Get Customer's Purchased Products 
        
        data.customer = {};
        data.discounts = [];

        if (productline.value == 'Residential') {
            data.products = ['205', '239', '241', '242'];
            data.customer.productlineid = 83;
        } else {
            data.products = ['241', '242', '246'];
            data.customer.productlineid = 84;
        } 
        
        var package = document.querySelectorAll('.package:checked');
        if (package.length == 0 ) data.products = [];

        var inputdata = document.querySelectorAll('#customerform input, #customerform select, #customerform textarea');
        var notempty = Array.from(inputdata).filter(single => single.value !== '' && single.classList.contains('inputbasic'));
        var checked = Array.from(inputdata).filter(single => single.checked);
        var newinputdata = [];
        
        for ( let i of notempty) newinputdata.push(i);
        for ( let i of checked) newinputdata.push(i);
        
        for ( let i = 0; i < newinputdata.length; i++ ) {    
            if (newinputdata[i].classList.contains('inputbasic'))  data.customer[newinputdata[i].name] = newinputdata[i].value;
            if (newinputdata[i].classList.contains('package')) {
                data.products.push(newinputdata[i].value);
                packages = newinputdata[i].value;
                if (newinputdata[i].getAttribute('data-discount') !== '') data.customer.packagediscount = newinputdata[i].getAttribute('data-discount');
            }
            if (newinputdata[i].classList.contains('disc') || newinputdata[i].classList.contains('otherpro')) {
                newinputdata[i].value === "true" ? data.discounts.push(newinputdata[i].id) : data.products.push(newinputdata[i].value); 
            }
        }
        if (data.customer.salesrep === 'marcos.centeno@dynamitewireless.com') data.customer.stage = '0';
        data.customer = validatedata(data.customer);
        let b = data.customer;
        cst.contact.fname = b.fname;
        cst.contact.lname = b.lname;
        cst.contact.email = b.email;
        cst.contact.phone = b.phone;
        cst.address.address1 = b.address1;
        cst.address.address2 = b.address2;
        cst.address.city = b.city;
        cst.address.state = b.state;
        cst.address.zip = b.zip;
        cst.ids.productline = b.productlineid;
        
        if (data.discounts.length > 0) {
            for (let i = 0; i < data.discounts.length; i++){
                var discount = data.discounts[i];
                var cust = data.customer;
                var promo = getdiscounts(discount, cust);
                for (let i = 0; i < promo.length; i++) data.products.push(promo[i]);   
            }
        }
        console.log(data.products);
        delete data.discounts;
        if (data.customer.productline == '' || data.customer.stage == '') { // check if required fields are not empty
            alert("Empty Required fields");
            return false;
        } else { //Send Gathered data to InfusionSoft
            data.products = Array.from( new Set( data.products ) );
            let api = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' },
                body: 'action=infusionsoft_sales_entry_api&data=' + JSON.stringify(data),
                url: infusionsoft_sales_entry_api_ajax.ajax_url,
                method: 'POST',
                report: true
            }
            
            apicall(api).then(function (res) {
                if (res.customer.infusionsoft_id) {
                    let remove = document.querySelector('.infusionsoftid');
                    if (remove) remove.remove(); 
                    status.insertAdjacentHTML("beforeend", `<a class="btn infusionsoftid" target="_blank" href="https://di427.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=${res.customer.infusionsoft_id}">#${res.customer.infusionsoft_id}</a>`);
                    cst.ids.infusionsoft = res.customer.infusionsoft_id;
                    cst.contact.referred_by =  document.querySelector('#referredby').value;
                }
                
                tinyMCE.triggerSave();
                var dispatchnotes = tinymce.editors['dispatchnotes'].getContent();
                if (res.customer.dispatchnotes)     tinymce.editors['dispatchnotes'].setContent(dispatchnotes + res.customer.dispatchnotes);
            });
            verifyagilecontact(data);
            
        } 
    }
    function reload_page() {
        location.reload();
    }
    function hideshowpackages() {
        var itemstouncheck = document.querySelectorAll('input[type=checkbox], input[type="radio"]');
        for ( let i = 0; i < itemstouncheck.length; i++ )     itemstouncheck[i].checked = false;
        let elem = document.querySelectorAll('.residential, .commercial');
        for ( let i = 0; i < elem.length; i++ ) { 
            let e = this.value.toLowerCase();
            if (elem[i].classList.contains('active')) elem[i].classList.remove('active');
            if (elem[i].classList.contains(e)) elem[i].classList.add('active');
        }
    }
    function getdiscounts(discount, cust) {
        var promolist = [];
        switch (discount) { 
            case 'neighbor30':
            case 'westmailer':
            case 'west18':
            case 'upgrade18':
                promolist = [ '203', '207' ];//FREE INSTALLATION
                break;
            case 'save30':
            case 'doorhanger18':
            case 'neighbor30':
            case 'neighbor':
            case '30mailer':
            case 'freemonth':
            case 'free_month':
            case 'save19':
                promolist = [ '264', '266', cust.packagediscount ]; // FREE MONTH
                break;
            case 'fiberme':
                promolist = [ '264' ]; //SAVE 10
                break;
            case 'freetrial':
                promolist = [ '203', '207', '264', '266', cust.packagediscount ];//FIRST MONTH FREE
                break;
            default:
            promolist = [];
        }
        return promolist;
    }
    function verifytoken() {
        var agiletoken = sessionStorage.getItem('agiletoken');
        var agileuser = sessionStorage.getItem('agileuser');
        if ( agiletoken == false || agiletoken == null || agiletoken == 'null' || agileuser == null || agileuser == 'null' ) {
            showlogin();
        } else {
            let api = {
                body: JSON.stringify({ token: agiletoken }),
                url: `${agileurl}auth-token/verify/`,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                method: 'POST'
            }
            return apicall(api).then(function (res) {
                if (res.status_code !== 200) {
                    showlogin();
                } else {
                    document.querySelector('#salesrep').value = sessionStorage.getItem('agileuser');
                    verifyinfusionsoftuser();
                }
            });
        }
    }
    function presskey(e) {         
        if (e.keyCode == 13 )     getagiletoken();
    }
    function getagiletoken() {
        let api = {
            body: JSON.stringify({
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value
            }),
            url: `${agileurl}auth-token/`,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            method: 'POST'
        }
        return apicall(api).then(function (res) {
            sessionStorage.setItem("agiletoken", res.token);
            sessionStorage.setItem("agileuser", res.email);
            verifytoken();
            hidepopups();
        });
    }
    function showlogin() {
        sessionStorage.setItem("agiletoken", "null");
        sessionStorage.setItem("agileuser", "null");
        backgroundcover.style.display = 'flex';
        agilelogin.style.display = 'flex';
        submitagiletoken.addEventListener('click', getagiletoken);
        document.addEventListener('keydown', presskey);
    }
    function apicall(api) {
        if(api.loading === true ) {
            hidepopups();
            backgroundcover.style.display = 'flex';
            loader.style.display = 'block';
        }
        var extra = {};
        return  fetch(api.url, {
            method: api.method,
            credentials: 'same-origin',
            headers: api.headers,
            body: api.body,
        }).then(function(res) {
            extra.status = res.status;
            return res.json();
        }).then(function(data) {
            if(!data.status_code) data.status_code = extra.status;
            if (api.report || (data.status_code !== 200 && data.status_code !== 202 && data.status_code !== 201) ) {
                let string = `[ Status: ${data.status_code} ]: `;
                if(data.detail) string += data.detail + '. ';
                if(data.status) string += data.status + '. ';
                if (data.message) string += data.message + '. ';
                if (data.status_code === 500) string += ' Please Try again in a moment. ';
                alert(string);
                console.log(api);
                console.log(data);
                console.log(cst);
            }
            if (api.loading === true) hidepopups();
            return data;
        });
    }
    function hidepopups() {
        for ( let i = 0; i < popupitem.length; i++ ) popupitem[i].style.display = 'none';
    }
    function populatecontact() {
        if (email.value != '') {
            data.populate = email.value;
            let api = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' },
                body: 'action=infusionsoft_sales_entry_api&data=' + JSON.stringify(data),
                method: 'POST',
                url: infusionsoft_sales_entry_api_ajax.ajax_url
            }
            apicall(api).then(function (data) {
                var salesrep = document.querySelector('#salesrep');
                if (data.count > 0) {
                    if (data.fname) document.querySelector('#fname').value = data.fname;
                    if (data.lname) document.querySelector('#lname').value = data.lname;
                    if (data.phone) document.querySelector('#phone').value = data.phone;
                    if (data.address) {
                        if (data.address.line1) document.querySelector('#address1').value = data.address.line1;
                        if (data.address.line2) document.querySelector('#address2').value = data.address.line2;
                        if (data.address.locality) document.querySelector('#city').value = data.address.locality;
                        if (data.address.region) document.querySelector('#state').value = data.address.region;
                        if (data.address.zip_code) document.querySelector('#zip').value = data.address.zip_code;
                    }
                    if (data.custom_fields) {
                        let a = data.custom_fields;
                        for (let i = 0; i < a.length; i++) {    
                            if (a[i].id === 7 ) { // 7 IS THE ID FOR "referred_by" FIELD
                                if (a[i].content !== 'null') {
                                    document.querySelector('#referredby').value = a[i].content;
                                    referrallookup();
                                }
                            }   
                        }
                    }
                    
                    populateaddress();
                    if (data.owner) {
                        if (data.owner[0].Email) {
                            salesrep.value = data.owner[0].Email;
                            if ( data.owner[0].Email == sessionStorage.getItem('agileuser') ) {
                                salesrep.style.color = '#32CD32';
                                salesrep.style.borderColor = '#32CD32';
                            } else {
                                salesrep.style.color = '#DC143C';
                                salesrep.style.borderColor = '#DC143C';
                            }
                        }
                    }
                } else {
                    salesrep.style.color = '#000000';
                    salesrep.style.borderColor = '#eceeef';
                }
            });
            for (const prop of Object.getOwnPropertyNames(data)) {
                delete data[prop];
            }              
        }      
    }
    function populateaddress() {
        if (zip.value != '') {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': zip.value }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    geocoder.geocode({'latLng': results[0].geometry.location}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) getCityState(results);
                    }
                });
                }
            }); 

        function getCityState(results) {
                var city = document.querySelector('#city');
                var state = document.querySelector('#state');
                var a = results[0].address_components;
                for(i = 0; i <  a.length; ++i) {
                    var t = a[i].types;
                    if (compIsType(t, 'administrative_area_level_1')) {
                        state.style.color = '#32CD32';
                        state.style.borderColor = '#32CD32';
                        state.value = a[i].long_name; //store the state
                    } else if (compIsType(t, 'locality')) {
                        city.style.color = '#32CD32';
                        city.style.borderColor = '#32CD32';
                        city.value = a[i].long_name; //store the city
                    }                   
                }                               
            }            
        }
        function compIsType(t, s) { 
            for(z = 0; z < t.length; ++z) 
               if (t[z] == s) return true;
            return false;
         }
    }
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
    function doublecheck(a, b) {
        ia.checked === true ? b.checked = true : b.checked = false;
    }
    function validatedata(contact) {
        if (contact.phone) contact.phone = contact.phone.replace(/[^0-9]/g, '');
        return contact;
    }
    function addpackagecontent(packagelist) {
        for ( let i = 0; i < packagelist.length; i++ ) { 
            if ( packagelist[i].classList.contains('residential')) { //INCLUDE RESIDENTIAL PRODUCTS HERE
                packagelist[i].insertAdjacentHTML("beforeend", `<div class="tablerow"><span class="cell">Installation Fee</span><span class="cell">$90</span></div>`);
            }
            if (packagelist[i].classList.contains('commercial')) {//INCLUDE COMMERCIAL PRODUCTS HERE
                packagelist[i].insertAdjacentHTML("beforeend", `<div class="tablerow"><span class="cell">Installation Fee</span><span class="cell">$199.95</span></div>`);
            }
            //INCLUDE GENERIC PRODUCTS HERE
            packagelist[i].insertAdjacentHTML("beforeend", `<div class="tablerow"><span class="cell">Rental Fee</span><span class="cell">$9.95</span></div>`);
            packagelist[i].insertAdjacentHTML("beforeend", `<div class="tablerow"><span class="cell">Activation Fee</span><span class="cell">$10</span></div>`);
        }    
    }
    function verifyagilecontact(data) {       
        var a = data.customer;
        let api = {
            url: `${agileurl}contact/?first_name=${a.fname}&last_name=${a.lname}&street=${a.address1}&street2=${a.address2}&city=${a.city}&state=${a.state}&zip=${a.zip}&email=${a.email}&phone=${a.phone}`,
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
            method: 'GET'
        }

        apicall(api).then(function (res) {
            console.log(res);
            var accounts = [];
            if (res.contact_match) {
                var pc = res.contact_match;
                if (res.contact_info_match) {
                    for ( let i = 0; i < res.contact_info_match.length; i++ ) pc.push(res.contact_info_match[i]);
                }
                for ( let i = 0; i < pc.length; i++ ) {
                    if (pc[i].linked_accounts) {
                        if (pc[i].linked_accounts.length > 0) {
                            for ( let e = 0; e < pc[i].linked_accounts.length; e++ ) { 
                                pc[i].linked_accounts[e].contact_id = res.contact_match[i].id;
                                accounts.push(pc[i].linked_accounts[e]);
                            }
                        }
                    }
                }
                accounts = Array.from( new Set( accounts.map(a => a.id))).map( id => { return accounts.find( a => a.id === id ) });

                if (accounts.length > 0) {
                    console.log(accounts);
                    backgroundcover.style.display = 'flex';
                    accountlistcontainer.style.display = 'block';
                    accountlist.innerHTML = '';
                    accountlist.insertAdjacentHTML("beforeend", `<h3 class="orange btnd">Found ${accounts.length} Powercode Accounts/Account <br>Select an account or create a new one</h3>`);
                    for ( let i = 0; i < accounts.length; i++ ) {

                        var address = '';
                        if (accounts[i].primary_address !== null) {
                            address = `${accounts[i].primary_address.street} ${accounts[i].primary_address.street2} ${accounts[i].primary_address.city}, ${accounts[i].primary_address.state} ${accounts[i].primary_address.postalcode} `;
                        }

                        accountlist.insertAdjacentHTML("beforeend", `
                            <button class="btnd pcaccounts orange" data-newaccount="false" data-agile="${accounts[i].contact_id}" data-powercode="${accounts[i].id}" data-accountnumber="${accounts[i].account_number}"> 
                                ${accounts[i].account_number}#${accounts[i].account_number}: ${accounts[i].account_name} Agile#${accounts[i].contact_id} - ${accounts[i].status}<br>
                                ${address}
                            </button>
                        `);
                    }
                    accountlist.insertAdjacentHTML("beforeend", `<button class="btnd pcaccounts orange" data-newaccount="true" data-accountid="" data-contactid="">Create New Account</button>`);
                    var accountclicked = document.querySelectorAll('.pcaccounts');
                    for ( let i = 0; i < accountclicked.length; i++ ) {
                        accountclicked[i].addEventListener('click', cstexists);
                    }
                    return;
                }
            }

            createagilecontact();

            function cstexists() {
            
                cst.ids.agileisp = this.getAttribute('data-agile');
                cst.ids.powercode = this.getAttribute('data-powercode');
                cst.ids.pc_account_number = this.getAttribute('data-accountnumber');
                
                if (cst.ids.agileisp !== null ) cst.ids.agileisp = parseInt(cst.ids.agileisp);
                if (cst.ids.powercode !== null ) cst.ids.powercode = parseInt(cst.ids.powercode);
                if (cst.ids.pc_account_number !== null ) cst.ids.pc_account_number = parseInt(cst.ids.pc_account_number);             
                if ( cst.ids.agileisp === null) createagilecontact();

                hidepopups();

                if (cst.ids.agileisp) schedulebtn.style.display = 'block';
            }
        });
    }
    function createagilecontact() {
         let api = {
            url: `${agileurl}contact/`,
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
            method: 'POST',
            body: {
                account_id: cst.ids.powercode,
                contact_id: cst.ids.agileisp,
                ifs_lead_id: cst.ids.infusionsoft,
                referred_by: {
                    account_number: cst.contact.referred_by_id,
                    referred_name: cst.contact.referred_by
                },
                first_name: cst.contact.fname,
                last_name: cst.contact.lname,
                email_preference: false,
                sms_preference: false,
                update_existing: true,
                same_billing: true,
                // create_account: cst.settings.create_account,
                create_account: true,
                service_street: cst.address.address1,
                service_street2: cst.address.address2,
                service_city: cst.address.city, 
                service_state: cst.address.state,
                service_zip: cst.address.zip,
                email: cst.contact.email,
                phone: cst.contact.phone
            },
            loading: true
        }
        
        Object.keys(api.body).forEach(function(key) {
            
            if (key === 'referred_by') {
                var o = api.body[key];
                Object.keys(o).forEach(function(key) {
                    if ( o[key] === ''  || o[key] === undefined || o[key] === null ) {
                        delete o[key];
                    }
                });
            }

            if ( api.body[key] === ''  || api.body[key] === undefined || api.body[key] === null ) {
                delete api.body[key];
            }
        });
    
        api.body = JSON.stringify(api.body);
        apicall(api).then(function (res) {
            console.log('new code');
            console.log(res);
            hidepopups();
            if (res.contact) cst.ids.agileisp = res.contact.id;
            if (res.account) {
                cst.ids.powercode = res.account.id;
                cst.ids.pc_account_number = res.account.account_number;
            }
            if (res.error) {
                if (res.error.contact) cst.ids.agileisp = res.error.contact.id;
            }
            if (cst.ids.agileisp)  schedulebtn.style.display = 'block';

            if (cst.settings.schedule === true) {
                var get_wo_type = document.querySelector('#type_id').value;
                tinyMCE.triggerSave();
                dispatchnotes = tinymce.editors['dispatchnotes'].getContent();
                var slotchecked = document.querySelector('.slotlist:checked');
                                                   
                var timeslot = parseInt(slotchecked.getAttribute('timeslotid'));
                var scheduledate = slotchecked.getAttribute('date');

                if (timeslot) {
                    let api = {
                        url: `${agileurl}job-schedule/`,
                        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
                        body: JSON.stringify({
                                contact_id: cst.ids.agileisp,
                                account_id: cst.ids.powercode,
                                product_line_id: cst.ids.productline,
                                type_id: parseInt(get_wo_type),
                                timeslot_id: parseInt(timeslot),
                                date: scheduledate,
                                notes: dispatchnotes
                        }),
                        method: 'POST',
                        loading: true
                    }
                    apicall(api).then(function (res) {
                        var woid = res.schedule.workorder.id;
                        if (woid) {
                            var agilewoid = document.querySelector('.agilewoid');
                            if (agilewoid) { 
                                agilewoid.remove(); 
                            }
                            status.insertAdjacentHTML("beforeend", `<a class="btn agilewoid" target="_blank" href="https://www.agileisp.com/?s=wo&p=edit&pk=${woid}">Agile #${woid}</a>`);
                        }
                    });
                } else {
                    alert('Time slot not selected');
                }
            }
        });
    }
    function schedulewo() {
        cst.settings.schedule = true;
        if (cst.ids.powercode === null || cst.ids.powercode === undefined) {
            cst.settings.create_account = true;
        }
        createagilecontact();
        return;                
    }
    function openschedule() {
        
        var get_wo_type = document.querySelector('#type_id').value;
        schedulecontent.innerHTML = '';

        if (cst.ids.agileisp) {
            let api = {
                url: `${agileurl}job-schedule/?days=90&limit=45&contact_id=${cst.ids.agileisp}&type_id=${get_wo_type}&return_models=true`,
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
                method: 'GET',
                loading: true
            }
            
            apicall(api).then(function (res) {
                for (let i = 0; i < Object.keys(res.availability).length; i++) {
                    var schedule = res.availability[i];
                    var day = document.createElement('div');
                    day.classList.add('day');

                    let a = schedule.date.split('-');
                    let newdate = `${a[1]}-${a[2]}-${a[0]}`;
                    let date = new Date(newdate);
                    var dayName = date.toString().split(' ')[0];

                    day.insertAdjacentHTML("beforeend", `<h4>${dayName} ${schedule.date}</h4> `);
                    let sche = schedule.timeslots;
                    for (let e = 0; e < Object.keys(sche).length; e++) {
                        let disabled = '';
                        let color = 'green';
                        if (sche[e].available <= 2 && sche[e].available >= 0) {    color = 'gray';   }
                        if (sche[e].available < 0) { color = 'orange'; }
                        if ( sche[e].available <= 2){  disabled = 'disabled';  }
                        var name = sche[e].name.split('(')[1];
                        name = name.replace(')', '');
                        day.insertAdjacentHTML("beforeend", `
                            <label class="slot ${color}" for="slot${i}${sche[e].id}">
                                <input type="radio" class="slotlist" name="slot" id="slot${i}${sche[e].id}" date="${schedule.date}" timeslotid="${sche[e].id}" ${disabled}>
                                <p>${name}</p>
                                <p>${sche[e].available}</p>
                            </label>
                        `);
                    }
                    schedulecontent.appendChild(day);
                }                        
                backgroundcover.style.display = 'flex';
                schedulepopup.style.display = 'block';
            });
        }       
    }
    function referrallookup() {

        var referredby = document.querySelector('#referredby').value;
        if (referredby === 'no' || referredby === '' || referredby === 'null' || referredby === null) {
            return;
        }
        let api = {
            url: `${agileurl}account/find/?account_name=${referredby}&include_inactive=true`,
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
            method: 'GET'
        }
        apicall(api).then(function (res) {
            if (res.result.length > 0) {
                var x = res.result;
                backgroundcover.style.display = 'flex';
                accountlistcontainer.style.display = 'block';
                accountlist.innerHTML = '';
                accountlist.insertAdjacentHTML("beforeend", `<h3 class="red btnd">Found ${x.length} potential referral matches/match</h3>`);
                for ( let i = 0; i < x.length; i++ ) {
                    var address = '';
                    if (x[i].primary_address !== null) {
                        address = `${x[i].primary_address.street} ${x[i].primary_address.street2} ${x[i].primary_address.city}, ${x[i].primary_address.state} ${x[i].primary_address.postalcode} `;
                    }

                    accountlist.insertAdjacentHTML("beforeend", `
                        <button class="btnd referralid red" data-accountnumber="${x[i].account_number}"> 
                            ${x[i].status} #${x[i].account_number}: ${x[i].account_name} <br>
                            ${address}
                        </button>
                    `);
                }
                var accountclicked = document.querySelectorAll('.referralid');
                for ( let i = 0; i < accountclicked.length; i++ ) {
                    accountclicked[i].addEventListener('click', assignrefferal);
                }
            }
            function assignrefferal() {
                cst.contact.referred_by_id = this.getAttribute('data-accountnumber');
                cst.contact.referred_by = document.querySelector('#referredby').value;
                hidepopups();
                
            }
        });
    }
    schedulesubmit.addEventListener('click', schedulewo);
    referredby.addEventListener('change', referrallookup);
    wo_type.addEventListener('change', openschedule);
    schedulebtn.addEventListener('click', openschedule); 
    productline.addEventListener('change', hideshowpackages);
    submit.addEventListener('click', cst_order_get_data);
    for ( let i = 0; i < close.length; i++) close[i].addEventListener('click', hidepopups);
    email.addEventListener('change', populatecontact);
    zip.addEventListener('change', populateaddress);
    zip.addEventListener('focusout', populateaddress);
    renewtoken.addEventListener('click', verifytoken);
    reset.addEventListener('click', reload_page);
    fax.addEventListener('click', doublecheck.bind(null, fax, ata));
    faxcom.addEventListener('click', doublecheck.bind(null, faxcom, atacom));
    // function calendar(target, date) {
    //     var date, calendar, container;
    //     switch (typeof date) {
    //         case 'string':
    //             date = date.split('-');
    //             date = new Date(date[0], parseInt(date[1], 10) - 1, date[2]);
    //             break;
    //         case 'undefined':
    //             date = new Date();
    //             break;
    //         case 'object':
    //             if (date instanceof Array) {
    //             data = date;
    //             date = new Date();
    //             } else {
    //             date = date;
    //             }
    //             break;
    //         default:
    //             throw 'Invalid date type!';
    //     }
    //     console.log(date);
    //     container = document.querySelector(target);
    //     calendar = buildTable(date.getFullYear(), date.getMonth());
    //     console.log(calendar);
    //     container.appendChild(calendar);
    //     container.appendChild(buildControls(date));
    //     function buildTable(year, month) {
    //         var controlDate = new Date(year, month + 1, 0);
    //         var currDate = new Date(year, month, 1);
    //         var iter = 0;
    //         var ready = true;
    //         var table = newElement('table');
    //         var thead = newElement('thead');
    //         var tbody = newElement('tbody');
    //         var tr;
    //         console.log(month);
    //         if (currDate.getDay() !== 0) {  iter = 0 - currDate.getDay();    }
    //         while (ready) {
    //             if (currDate.getDay() === 6) {
    //                 if (tr) {  tbody.appendChild(tr);    }
    //                 tr = null
    //             }
    //             if (!tr) {   tr = newElement('tr'); }
    //             currDate = new Date(year, month, ++iter);
    //             tr.appendChild(newDayCell(currDate, iter < 1 || +currDate > +controlDate));
    //             if (+controlDate < +currDate && currDate.getDay() === 0) {  ready = false;  }
    //         }
    //         thead.innerHTML = `<tr><th class="day">Sun</th><th class="day">Mon</th><th class="day">Tue</th><th class="day">Wed</th><th class="day">Thu</th><th class="day">Fri</th><th class="day">Sat</th></tr>`;
    //         table.appendChild(thead);
    //         table.appendChild(tbody);
    //         table.className = 'calendar';
    //         table.setAttribute('data-period', year + '-' + (month));
    //         return table;
    //     }
    //     function newDayCell(dateObj, isOffset) {
    //         var td = newElement('td');
    //         var number = newElement('span');
    //         var isoDate = dateObj.toISOString();
    //         isoDate = isoDate.slice(0, isoDate.indexOf('T'));
    //         number.insertAdjacentHTML("beforeend", dateObj.getDate());
    //         // number.insertAdjacentHTML("beforeend", `
    //         //     <input type="radio" name="slot" id="slot${i}${shedule.timeslots[0].id}" date="${shedule.date}" timeslotid="${shedule.timeslots[0].id}">
    //         //     <label class="slot" for="slot${i}${shedule.timeslots[0].id}">
    //         //         <h4>Morning</h4><p>(08:00 AM - 12:00 PM)</p>
    //         //         <h3>${shedule.timeslots[0].capacity}</h3>
    //         //     </label>
    //         //     <input type="radio" name="slot" id="slot${i}${shedule.timeslots[1].id}" date="${shedule.date}" timeslotid="${shedule.timeslots[1].id}">
    //         //     <label class="slot" for="slot${i}${shedule.timeslots[1].id}">
    //         //         <h4>Afternoon</h4><p>(01:00 PM - 06:00 PM)</p>
    //         //         <h3>${shedule.timeslots[1].capacity}</h3>
    //         //     </label>
    //         // `); 
    //         td.className = isOffset ? 'day adj-month' : 'day';
    //         td.setAttribute('data-date', isoDate);
    //         //console.log(number);
    //         td.appendChild(number);
    //         return td;
    //     }          
    //     function newElement(tagName) {   return document.createElement(tagName);   }
    //     function buildControls(date) {
    //         var div = newElement('div');
    //         var prevBtn = newElement('span');
    //         var nextBtn = newElement('span');
    //         prevBtn.innerHTML = '&larr;';
    //         prevBtn.className = 'calendar-control';
    //         prevBtn.setAttribute('data-calendar-control', 'prev');
    //         nextBtn.innerHTML = '&rarr;';
    //         nextBtn.className = 'calendar-control';
    //         nextBtn.setAttribute('data-calendar-control', 'next');
    //         div.className = 'calendar-controls';
    //         div.appendChild(prevBtn);
    //         div.appendChild(nextBtn);
    //         removeEventListener(document, 'click', calendarControlClick);
    //         addEventListener(document, 'click', calendarControlClick);
    //         function calendarControlClick(evt) {
    //             evt.preventDefault();
    //             if (!evt.target.getAttribute('data-calendar-control')) {   return;  }
    //             var target = evt.target;
    //             while (target.parentNode) {
    //             if (target.parentNode === container) {  break; }
    //             target = target.parentNode;
    //             if (!target) { return; }
    //             }          
    //             var action = evt.target.getAttribute('data-calendar-control');          
    //             switch (action) {
    //             case 'prev':
    //                 date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    //                 break;
    //             case 'next':
    //                 date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    //                 break;
    //             }
    //             calendar = buildTable(date.getFullYear(), date.getMonth());
    //             container.removeChild(container.firstChild);
    //             container.insertBefore(calendar, container.firstChild);
    //         }
    //         return div;
    //     }
    //     function addEventListener(target, event, handler) {
    //         if (document.addEventListener) {
    //             target.addEventListener(event, handler, false)
    //         } else {
    //             target.attachEvent('on' + event, handler)
    //         }
    //     }
    //     function removeEventListener(target, event, handler) {
    //         if (document.removeEventListener) {
    //             target.removeEventListener(event, handler, false)
    //         } else {
    //             target.detachEvent('on' + event, handler)
    //         }
    //     }
    // }
    // function packageclicked(e) {
    //     console.log(this);
    //     var allradio = document.querySelectorAll('.packages label .tablerow');
    //     for (var i = 0; i < allradio.length; i++) { 
    //         allradio[i].style.display = 'none';
    //     }
    //     var tablerow = this.querySelectorAll('.tablerow');
    //     var radiobtn = this.querySelector('input');
    //     radiobtn.checked = 'checked';
    //     console.log(radiobtn);
    //     for (var i = 0; i < tablerow.length; i++) {
    //         if (tablerow[i].style.display  === 'none') {
    //             tablerow[i].style.display = 'flex';
    //         }    
    //     }
    //     e.stopPropagation();
    //     e.preventDefault(); 
    // }

    // for ( let i = 0; i < packagelist.length; i++ ) { 
    //     packagelist[i].addEventListener('click', packageclicked);
    // }
});


// document.addEventListener("DOMContentLoaded", function(){
//     setTimeout(myUpdate, 1000);
// });
  
// function myUpdate(){
//   let element = document.querySelector('#change_input');
//   changeValue(element, 'I changed it programmatically.')
// }

// function changeValue(element, value) {
//   if (!(element.value === value)){
//     element.value = value;
//     console.log('Changed programmatically:', value);
//   } else {
//     console.log('The value was changed, but not programmatically.');
//   }
//   //do the normal stuff here
// }

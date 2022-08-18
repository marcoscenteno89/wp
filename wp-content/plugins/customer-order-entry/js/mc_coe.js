document.addEventListener("DOMContentLoaded", function() {
    var wo_type = document.querySelector('#type_id');
    var accountlist = document.querySelector('#accountlist');
    var accountlistcontainer = document.querySelector('.accountlistcontainer');
    var packagelist =  document.querySelectorAll('.packages > label');
    //var agileurl = 'https://www.agileisp.com/api/';
    var agileurl = 'http://127.0.0.1:8000/api/';
    // const cst = {};
    // cst.contact = {};
    // cst.address = {};
    // cst.settings = {};
    // cst.ids = {};
    // const data = {};
    // cst.settings.create_account = false;
    console.log(agiletoken());
    // agiletoken().then(function(data) {
    //     openschedule();
    // })

    prompt({'remove': true})
    form(document.querySelector('#customer-form')).then( function (res) {
        console.log(res);
    });
    addpackagecontent(packagelist);
    // calendar('#calendar');
    function verifyinfusionsoftuser() {
        data.verifyuser = sessionStorage.getItem('agileuser');
        let api = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' },
            body: 'action=mc_coe_ajax&data=' + JSON.stringify(data),
            method: 'POST',
            url: mc_coe_ajax.ajax_url
        }
        apicall(api).then(function (res) {
            if (res.valid_user === false) {
                document.getElementById("salesrep").disabled = true;
            }
        });
        for (const prop of Object.getOwnPropertyNames(data)) {
            delete data[prop];
        } 
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
        if (package.length == 0 ){
            data.products = [];
        }

        var inputdata = document.querySelectorAll('#customerform input, #customerform select, #customerform textarea');
        var notempty = Array.from(inputdata).filter(single => single.value !== '' && single.classList.contains('inputbasic'));
        var checked = Array.from(inputdata).filter(single => single.checked);
        var newinputdata = [];
        
        for ( let i = 0; i < notempty.length; i++ ) {
            newinputdata.push(notempty[i]);
        }

        for ( let i = 0; i < checked.length; i++ ) {
            newinputdata.push(checked[i]);
        }
        
        for ( let i = 0; i < newinputdata.length; i++ ) {    
            if (newinputdata[i].classList.contains('inputbasic')) {
                data.customer[newinputdata[i].name] = newinputdata[i].value;
            }
            if (newinputdata[i].classList.contains('package')) {
                data.products.push(newinputdata[i].value);
                packages = newinputdata[i].value;
                if (newinputdata[i].getAttribute('data-discount') !== '') {
                    data.customer.packagediscount = newinputdata[i].getAttribute('data-discount');
                }
            }
            if (newinputdata[i].classList.contains('disc') || newinputdata[i].classList.contains('otherpro')) {
                if (newinputdata[i].value === "true") {
                    data.discounts.push(newinputdata[i].id);
                } else {
                    data.products.push(newinputdata[i].value); 
                }
            }
        }
        if (data.customer.salesrep === 'marcos.centeno@dynamitewireless.com') {
            data.customer.stage = '0';
        }
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
                for (let i = 0; i < promo.length; i++) {    data.products.push(promo[i]);    }
            } 
        }
        delete data.discounts;
        if (data.customer.productline == '' || data.customer.stage == '') { // check if required fields are not empty
            alert("Empty Required fields");
            return false;
        } else { //Send Gathered data to InfusionSoft
            data.products = Array.from( new Set( data.products ) );
            let api = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' },
                body: 'action=mc_coe_ajax&data=' + JSON.stringify(data),
                url: mc_coe_ajax.ajax_url,
                method: 'POST'
            }
            
            apicall(api).then(function (res) {
                if (res.customer.infusionsoft_id) {
                    let remove = document.querySelector('.infusionsoftid');
                    if (remove) { 
                        remove.remove(); 
                    }
                    status.insertAdjacentHTML("beforeend", `<a class="btn infusionsoftid" target="_blank" href="https://di427.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=${res.customer.infusionsoft_id}">#${res.customer.infusionsoft_id}</a>`);
                    cst.ids.infusionsoft = res.customer.infusionsoft_id;
                    cst.contact.referred_by =  document.querySelector('#referredby').value;
                }
                
                tinyMCE.triggerSave();
                var dispatchnotes = tinymce.editors['dispatchnotes'].getContent();
                if (res.customer.dispatchnotes) {
                    tinymce.editors['dispatchnotes'].setContent(dispatchnotes + res.customer.dispatchnotes);
                }
            });
            verifyagilecontact(data);
            
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
    function agiletoken() {
        let isvalid = false;
        let api = {
            body: JSON.stringify({ token: sessionStorage.getItem('agiletoken') }),
            url: `${agileurl}auth-token/verify/`,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            method: 'POST'
        }
        apicall(api).then(function (res) {
            if (res.status !== 200) gettoken();
            isvalid = true;
        });
        return isvalid;
        function gettoken() {
            let api = {
                body: JSON.stringify({
                    username: 'marcos',
                    password: 'Idon+know1'
                }),
                url: `${agileurl}auth-token/`,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                method: 'POST'
            }
            apicall(api).then( function(res) {
                sessionStorage.setItem("agiletoken", res.token);
                agiletoken();
            });
        }
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
                    for ( let i = 0; i < res.contact_info_match.length; i++ ) {
                        pc.push(res.contact_info_match[i]);
                    }
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
                
                if (cst.ids.agileisp !== null ) {
                    cst.ids.agileisp = parseInt(cst.ids.agileisp);
                }
                if (cst.ids.powercode !== null ) {
                    cst.ids.powercode = parseInt(cst.ids.powercode);
                }
                if (cst.ids.pc_account_number !== null ) {
                    cst.ids.pc_account_number = parseInt(cst.ids.pc_account_number);
                }              
                if ( cst.ids.agileisp === null) {                    
                    createagilecontact();
                }

                hidepopups();

                if (cst.ids.agileisp) {
                    schedulebtn.style.display = 'block';
                }
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
                create_account: cst.settings.create_account,
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
            hidepopups();
            if (res.contact) {
                cst.ids.agileisp = res.contact.id;
            }
            if (res.account) {
                cst.ids.powercode = res.account.id;
                cst.ids.pc_account_number = res.account.account_number;
            }
            if (res.error) {
                if (res.error.contact) {
                    cst.ids.agileisp = res.error.contact.id;
                }
            }
            if (cst.ids.agileisp) {
                schedulebtn.style.display = 'block';
            }

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

            let api = {
                url: `${agileurl}job-schedule/?days=90&limit=45&contact_id=36241&type_id=30&return_models=false`,
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${sessionStorage.getItem('agiletoken')}` },
                method: 'GET'
            }
            console.log(api);
            apicall(api).then(function (res) {
                console.log(res);
                // for (let i = 0; i < Object.keys(res.availability).length; i++) {
                //     var schedule = res.availability[i];
                //     var day = document.createElement('div');
                //     day.classList.add('day');

                //     let a = schedule.date.split('-');
                //     let newdate = `${a[1]}-${a[2]}-${a[0]}`;
                //     let date = new Date(newdate);
                //     var dayName = date.toString().split(' ')[0];

                //     day.insertAdjacentHTML("beforeend", `<h4>${dayName} ${schedule.date}</h4> `);
                //     let sche = schedule.timeslots;
                //     for (let e = 0; e < Object.keys(sche).length; e++) {
                //         let disabled = '';
                //         let color = 'green';
                //         if (sche[e].available <= 2 && sche[e].available >= 0) {    color = 'gray';   }
                //         if (sche[e].available < 0) { color = 'orange'; }
                //         if ( sche[e].available <= 2){  disabled = 'disabled';  }
                //         var name = sche[e].name.split('(')[1];
                //         name = name.replace(')', '');
                //         day.insertAdjacentHTML("beforeend", `
                //             <label class="slot ${color}" for="slot${i}${sche[e].id}">
                //                 <input type="radio" class="slotlist" name="slot" id="slot${i}${sche[e].id}" date="${schedule.date}" timeslotid="${sche[e].id}" ${disabled}>
                //                 <p>${name}</p>
                //                 <p>${sche[e].available}</p>
                //             </label>
                //         `);
                //     }
                //     schedulecontent.appendChild(day);
                // }                        
                // backgroundcover.style.display = 'flex';
                // schedulepopup.style.display = 'block';
            });     
    }
});

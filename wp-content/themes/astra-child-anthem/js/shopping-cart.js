document.addEventListener("DOMContentLoaded", async () => {

  // VARIABLES
  const agileUrl = 'https://agileisp.com/api/';
  const curPg = window.location.pathname;
  const agileLogin = document.querySelector('.loginbg');
  const agileSubmit = document.querySelector('.loginbtn');
  const loginStatus = document.querySelector('.loginform .loginstatus');
  const salesRep = document.querySelector('[name=sales_rep]');
  const next = document.querySelector('[name=next]');
  const prev = document.querySelector('[name=prev]');	
  const sendContract = document.querySelector('#send_contract');
  let newUrl = new URLSearchParams(window.location.search);
  let owner = document.querySelectorAll('.shopping-cart [name="own_location"]');
  let zone_status = document.querySelector('.zone_status');
  let addon = document.querySelectorAll('.addon');
  let addon_tags = document.querySelector('.addontags');
  let email = document.querySelector('.lookup');
  let login = document.querySelector('.login');
  let wbOb;
  const values = {
    create_account: true,
    packages: []
  }

  const verifyToken = tok => {
    let api = {
      url: `${agileUrl}auth-token/verify/`,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
      body: JSON.stringify({token: tok})
    }
    return ajax(api).then(res => {
      if (![200, 201, 202].includes(res.status)) console.log(res);
      return res.token ? true : false;
    });
  }
  const refreshToken = tok => {
    let api = {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      url: `${agileUrl}auth-token/refresh/`,
      method: 'POST',
      body: JSON.stringify({token: tok})
    }
    return ajax(api).then(res => {
      if (![200, 201, 202].includes(res.status)) console.log(res);
      localStorage.setItem("agileRepToken", res.token);
      localStorage.setItem("agileRepEmail", res.email);
      return res;
    });
  }
  const updateToken = token => {
    let api = {
      body: `action=agile_token&token=${token}`,
      method: 'POST',
      url: agile_token.ajax_url
    }
    return ajax(api).then(res => {
      console.log(res);
      localStorage.setItem("agileRepToken", res.token);
      localStorage.setItem("agileRepEmail", res.email);
      return res.token;
    });
  }
  const getToken = async () => {
    let agileRepToken = localStorage.getItem("agileRepToken");
    let agileRepEmail = localStorage.getItem("agileRepEmail");
    if (curPg.includes('sales-entry') || curPg.includes('access')) {
      if(agileRepEmail === 'cmason@anthembusinessgroup.com') {
        agileRepToken = null;
        agileRepEmail = null;
      }
      if (agileRepToken) {
        if (await verifyToken(agileRepToken)) {
          salesRep.value = agileRepEmail;
          agileLogin.style.display = 'none';
          return agileRepToken;
        } else {
          agileLogin.style.display = 'flex';
        }
      } else {
        agileLogin.style.display = 'flex';
      }
    } else {
      // If token is null request brand new token 
      if (exists.includes(agileRepToken)) {
        return updateToken('');
      }
      // check if agile token is valid. 
      // Attempt to refresh token if no longer valid
      if (await verifyToken(agileRepToken)) {
        if (salesRep) salesRep.value = agileRepEmail;
        return agileRepToken;
      } else {
        // Try to refresh Agile token
        let newToken = await refreshToken(agileRepToken);
        // If refreshtoken is sucessfull, send new token to server
        // If refreshtoken is not sucessfull, request server for a brand new token
        return newToken.token ? newToken.token : updateToken(''); 
      }
    }
  }
  const newRepToken = async (e) => {
    e.preventDefault();
    loginStatus.innerHTML = '';
    let api = {
      url: `${agileUrl}auth-token/`,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
      body: JSON.stringify({
        username: document.querySelector('[name=username]').value,
        password: document.querySelector('[name=password]').value
      })
    }
    await ajax(api).then(async res => {
      if (![200].includes(res.status)) {
        console.log(res);
        loginStatus.innerHTML = `<div class="warning">${res.non_field_errors[0]}</div>`;
      }
      localStorage.setItem("agileRepToken", res.token);
      localStorage.setItem("agileRepEmail", res.email);
      salesRep.value = res.email;
      agileLogin.style.display = 'none';
      setTimeout(() => loadPackages(), 500);
      
    });
  }
  const loadPackages = async () => {
    let token = await getToken();
    let api = {
      url: `${agileUrl}sales-package/?o=5&html=false`,
      method: 'GET',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`})
    }
    await ajax(api).then(res => {
      let container = document.querySelector('.shopping-cart .packages');
      if (container) {
        if ([200, 201, 202, 203].includes(res.status) && container) {
          let pack = res.data.filter(i => {
            return i.product_category__name === 'Fiber' && i.product_line__name === 'Residential' && i.id !== 68;
          });
          let cell = '';
          for (let i = 0; i < 9; i++) cell += '<div class="w-cell"></div>';
      
          let percent = 100 - (pack.length * 20);
          for (let i of pack) {
            let tmp = percent;
            percent = tmp + 20;
            container.insertAdjacentHTML("afterbegin", `
              <input type="radio" placeholder="Package" class="form-input" name="package" value="${i.id}" id="id-${i.id}">
              <label for="id-${i.id}" class="paq${i.id === 74 ? ' active' : ''}">
                <h3 class="amount">$${i.monthly_price}</h3>
                <div class="anim-container">
                  <div class="anim">${cell}</div>
                  <div class="hide" style="left:${percent}%"></div>
                </div>
                <h3 class="title">${i.name}</h3>
                <h4 style="color:#fff;">${i.speed}</h4>
                <div class="action" data-id="id-${i.id}" data-html="Select">Select</div>
                ${i.id === 74 ? '<div class="main">MOST POPULAR</div>' : ''}
              </label>
            `);
            let checkbox = document.querySelector(`#id-${i.id}`);
            let btn = document.querySelector(`[data-id="${i.id}"]`);
            checkbox.addEventListener('click', (elem) => {
              let btns = document.querySelectorAll(`[data-html]`);
              for (let i of btns) i.innerHTML = i.getAttribute('data-html');
              let btn = document.querySelector(`[data-id="${elem.target.id}"]`);
              if (elem.target.checked === true) btn.innerHTML = 'Selected';
            });
          }
          let accordion = document.querySelectorAll('[data-accordion="accordion"]');
          for (let i of accordion) add_accordion(i);
          console.log('Loaded packages....')
        } else {
          let msg = 'Failed to load packages....'
          console.log(`Agile: ${res.detail}`);
          container.insertAdjacentHTML("afterbegin", `<div class="warning col-12">${msg}</div>`);
        }
      }
    });
  }
  const agileLookup = async (token, data) => {
    let api = {
      url: `${agileUrl}contact/?o=5&first_name=${data.given_name}&last_name=${data.family_name}&email=${data.email}`,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      method: 'GET'
    }
    const results = await ajax(api).then(res => res);
    if (results.contact_match) {
      let con = results.contact_match.filter(i => {
        if (i.linked_accounts) {
          if (i.linked_accounts.length > 0) return i;
        }
      });
      if (con.length > 0 ) {
        let cur = con[0];
        data.contact_id = cur.id;
        data.create_account = false;
        if (cur.linked_accounts) {
          if (cur.linked_accounts.length > 0) {
            data.account_id = cur.linked_accounts[0].id;
          }
        }
        return {agile: cur, data: data};
      }
    }
    return {agile: false, data: data};
  }
  const agileScheduleLookup = (token, id) => {
    let api = {
      url: `${agileUrl}job-schedule/?days=90&limit=45&contact_id=${id}&type_id=${30}&return_models=true`,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      method: 'GET'
    }
    return ajax(api).then(res => {
      values.availability = res.availability;
      return res;
    });
  }
  const keapLookup = (email) => {
    let api = {
      body: `action=fi_get_contact&email=${email}`,
      url: fi_get_contact.ajax_url,
      method: 'POST'
    }
    return ajax(api).then(res => {
      let temp = res.custom_fields;
      res.custom_fields = temp.filter(i => i.content !== null);
      return res;
    });
  }
  const getSchedule = (e) => {
    const app = document.querySelector('.appointments');
    const morning = app.querySelector('.morning');
    const afternoon = app.querySelector('.afternoon');
    const date = app.querySelector('.date');
    const dates = e.filter(i => i.available > 6);
    let pastDates = true, availableDates = false, availableWeekDays = false
    let calendar = new VanillaCalendar({
      selector: "#myCalendar",
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortWeekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      pastDates: false,
      datesFilter: true,
      availableDates: dates,
      onSelect: (data, elem) => {
        values.date = data.data.date;
        document.querySelector('input[name="date"]').value = data.data.date;
        app.style.display = 'flex';
        date.innerHTML = data.data.date;
        morning.innerHTML = data.data.timeslots[0].name;
        afternoon.innerHTML = data.data.timeslots[1].name;
      }
    });
  }
  const infusionsoftSubmit = (dat) => {
    let api = {
      body: `action=fi_submit_contact&data=${JSON.stringify(dat)}`,
      url: fi_submit_contact.ajax_url,
      method: 'POST'
    }
    return ajax(api).then(res => {
      if ( [200, 201].includes(res.contact.status_code) ) {
        if (res.contact) {
          let i = res.contact;
          if (i.id) values.ifs_lead_id = i.id;
        }
        let conEmail = res.contact.email_addresses.filter(i => i.field === 'EMAIL1')[0];
        console.log(`Keap: Stored data for ${conEmail.email}.`);
        return res;
      } else {
        console.log(`Keap: ${res.contact.fault.faultstring}`);
        return false;
      }
    });
  }
  const agileSubmitContact = async (token, a) => {
    const body = {
      email_preference: false,
      sms_preference: false,
      update_existing: true,
      same_billing: true,
      create_account: a.create_account,
      service_street: a.line1,
      service_street2: '',
      service_city: a.locality,
      service_state: a.region,
      service_zip: a.postal_code,
      email: a.email,
      phone: a.phone,
      first_name: a.given_name,
      last_name: a.family_name,
      // force_svc: 1,
      // force_bill: 1,
      org_id_list: [5]
    }
    if (a.account_id) body.account_id = a.account_id;
    if (a.contact_id) body.contact_id = a.contact_id;
    if (a.ifs_lead_id) body.ifs_lead_id = a.ifs_lead_id;
    let api = {
      url: `${agileUrl}contact/`,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      method: 'POST',
      body: JSON.stringify(body)
    }
    return await ajax(api).then(res => res);
  }
  const scheduleWo = async (token, data) => {
    let api = {
      url: `${agileUrl}workorder/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify({
        contact_id: parseInt(data.contact_id),
        account_id: parseInt(data.account_id),
        product_line_id: data.product_line === 'Residential' ? 83 : 84,
        type_id: 1082,
        workorder_org_id_list: [5],
        o: 5,
        notes: data.notes
      })
    }
    return await ajax(api).then(res => res);
  }
  const generateWoObj = (data) => {
    let ob = {  
      o: 5,
      contact_id: 0,
      contact_info: {
        first_name: data.given_name,
        last_name: data.family_name,
        service_address: {
          id: "0",
          street: data.line1,
          line2: data.line2,
          city: data.locality,
          state: data.region,
          postalcode: data.postal_code
        },
        email_list: [{ id: "0", data: data.email }],
        phone_list: [{ id: "0", data: data.phone }]
      },
      product_line: data.product_line,
      packages: []
    }
    if (data.sales_source !== '' && data.sales_source) {
      ob.sales_source = data.sale_source;
    }
    if (data.opportunity_stage !== '' && data.opportunity_stage) {
      ob.opportunity_stage = data.opportunity_stage;
    }
    if (data.workbook_id !== '') {
      ob.workbook_id = data.workbook_id;
    }
    if (data.ifs_lead_id !== '') {
      ob.external_lead_id = data.ifs_lead_id;
      ob.source_value =  "ifs";
    }
    return ob;
  }
  const workbook = async (data, elem, label) => {
    let token = await getToken();
    let api = {
      url: `${agileUrl}sales/save_workbook/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify(data)
    }
    return await ajax(api).then(res => {
      showStatus(res, elem, label);
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  const onTabChange = async (data, elem, curTab, stat) => {
    btnLoader(elem, true);
    let thisTab = {};
    
    data.forEach(i => {
      if (i.field.type === 'checkbox') {
        thisTab[i.field.name] = i.value === '' ? 'false' : i.value;
      } else {
        thisTab[i.field.name] = i.value;
      }
    });

    if (thisTab.create_contact) {
      let ifs = infusionsoftSubmit(thisTab);
      wbOb = generateWoObj(thisTab);
      let wb = await workbook(wbOb, elem, 'Workbook Entry');
      wbOb.workbook_id = parseInt(wb.result.workbook_id);
      let workbook_id_list = document.querySelectorAll('.shopping-cart [name=workbook_id]');
      for (let i of workbook_id_list) i.value = wb.result.workbook_id;
      let i = thisTab;

      if (document.querySelector('#vac')) {
        let vac = document.querySelector('#vac');
        vac.innerHTML = `${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}`;
      } 
      for (let fi of document.querySelectorAll('[name="email"]')) {
        if (fi.type === 'hidden') fi.value = thisTab.email;
      }
      delete thisTab.tags;
    }
    if (thisTab.agile_schedule) {
      let schedule = await agileScheduleLookup(token, thisTab.contact_id);
      getSchedule(values.availability);
      delete values.agile_schedule;
    }
    if (thisTab.package && thisTab.package !== '') {
      values.packages.push({ id: parseInt(thisTab.package), qty: 1 });
      wbOb.packages.push({ id: parseInt(thisTab.package), qty: 1 });
      let wbPack = await workbook(wbOb, elem, 'Package');
      delete thisTab.package;
    }
    if (thisTab.contracts) {
      thisTab.comments = `Workbook Order: #${values.workbook_id}`;
      let contractData = infusionsoftSubmit(thisTab);
      let i = thisTab;
      let or = '';
      let notes = `
        Agreed to Terms & Conditions: ${i.terms_conditions === 'true' ? true : false}
        Agreed to Give Property Access: ${i.property_access === 'true' ? true : false}
        Property Owner: ${i.own_location === 'true' ? true : false}
        Nid Location: ${i.nid_location}
        Agreed that this is a legal Signature: ${i.legal_signature === 'true' ? true : false}
        Customer requires to be at home during installation: ${i.installation_notification === 'true' ? true : false}
        ${i.notification_email ? 'Notification Email: ' + i.notification_email : ''}
        Customer Signature: ${i.customer_signature}
        Sales Representative: ${localStorage.getItem("agileRepEmail")}
        ${or !== '' ? `Products:<br>${or}`: ''}
      `;
      wbOb.opportunity_notes = notes;
      wbOb.sales_notes = notes;
      let wbNotes = await workbook(wbOb, elem, 'Notes');
      delete thisTab.tags;
    }
    if (thisTab.tags && thisTab.tags !== '') {
      if (thisTab.tags !== '') {
        let addons = await infusionsoftSubmit(thisTab);
      }
      delete thisTab.tags;
    }

    for (let key in thisTab) values[key] = thisTab[key];
    btnLoader(elem, false);
    return true;
  }
  const makeSale = async (token, workbook_id, elem) => {
    let api = {
      url: `${agileUrl}sales/make_sale/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify({workbook_id: workbook_id})
    }
    return await ajax(api).then(res => {
      showStatus(res, elem, 'Finish Sale');
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  const showStatus = (p, btn, label) => {
    let stat = document.querySelector('.shopping-cart .controller .status');
    if (![200, 201, 202].includes(p.status)) {
      if (p.detail) {
        stat.innerHTML = `<div class="warning">${p.detail}</div>`;
        console.log(p.detail);
      }
      btnLoader(btn, false);
    } else {
      console.log(`Agile: #${p.request.workbook_id} #${p.result.workbook_id} - ${label} ${p.detail}`);
    }
  }
  const initShopCartForm = async (firstTry=true) => {
    let shop = document.querySelector('.shopping-cart');
    if (shop) {
      setTimeout(() => loadPackages(), 1000);
      form(shop, onTabChange).then( async val => {
        btnLoader(next, true);
        let token = await getToken();
        let i = values;
        let or = '';

        if (!wbOb) {
          wbOb = generateWoObj(i);
          wbOb.packages.push({ id: 102, qty: 1 });
          let addPackage = await workbook(wbOb, next, 'WB Oject does not exists, Package');
        }

        if (wbOb.packages.length === 0) {
          wbOb.packages.push({ id: 102, qty: 1 });
          let addPackage = await workbook(wbOb, next, 'Package does not exist, Package');
        }

        let p = await makeSale(token, i.workbook_id, next);
        let records = ``;
        if (curPg.includes('sales-entry') && curPg.includes('access')) {
          let e = `https://agileisp.com/?`;
          let u = `https://vx952.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=`
          records = `
            Workorder Number: <a href="${e}s=wo&p=edit&pk=${p.result.workorder_id}&o=5" target="_blank"> 
              #${p.result.workorder_id}
            </a><br>
            Workbook Number: <a href="${e}o=5&s=sales&p=workbook&id=${p.result.workbook_id}" target="_blank"> 
              #${p.result.workbook_id}
            </a><br>
            Keap id: <a href="${u}${i.ifs_lead_id}" target="_blank"> 
              #${i.ifs_lead_id}
            </a><br>
          `;
        } else {
          records = `
            Workorder Number: #${p.result.workorder_id}<br>
            Workbook Number: #${p.result.workbook_id}<br>
          `;
        }

        shop.innerHTML = `
          <h4>Data submitted successfully</h4>
          Name: ${i.given_name} ${i.family_name}<br>
          Phone: ${i.phone}<br>
          Email: ${i.email}<br>
          ${i.notification_email ? `Notification Email: ${i.notification_email}<br>` : ''}
          ${records}
          Service Address: ${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}<br>
          Nid Location: ${i.nid_location}<br>
          Agreed to Terms & Conditions: ${i.terms_conditions === 'true' ? 'yes' : 'no'}<br>
          Agreed to Give Property Access: ${i.property_access === 'true' ? 'yes' : 'no'}<br>
          Property Owner: ${i.own_location === 'true' ? 'yes' : 'no'}<br>
          Agreed that this is a legal Signature: ${i.legal_signature === 'true' ? 'yes' : 'no'}<br>
          Customer requires to be at home during installation: ${i.installation_notification === 'true' ? 'yes' : 'no'}<br>
          ${or !== '' ? `Products:<br>${or}`: ''}
        `;
        btnLoader(next, false);
      });
    }
  }
  const woLookup = async (token, a) => {
    let api = {
      url: `${agileUrl}workorder/list_view/`,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      method: 'POST',
      body: JSON.stringify({wo_search: "marcos"})
    }
    return ajax(api).then(res => {
      console.log(res);
    });
  }
  
  // FUNTIONS

  await initShopCartForm();

  if (newUrl.get('address')) {
    if (document.querySelector('#vac')) {
      let ad = formatData(newUrl.get('address'));
      let city = formatData(newUrl.get('city'));
      let state = formatData(newUrl.get('state'));
      let zip = formatData(newUrl.get('zip'));
      document.querySelector('#vac').innerHTML = `${ad}, ${city}, ${state} ${zip}`;
    }
  }

  if (zone_status) {
    let url = newUrl.get('status');
    if (url) {
      let cap = url.charAt(0).toUpperCase() + url.slice(1);
      zone_status.innerHTML = cap;
    }
  }
 
  //EVENT LISTENERS

  if (sendContract) {
    sendContract.addEventListener('click', async (e) => {
      e.preventDefault();
      btnLoader(e.target, true);
      values.tags ? values.tags += ',366' : values.tags = '366';
      let ifs = await infusionsoftSubmit(values);
      let content = `
        <h2 class="heading flex-center">SUCCESS</h2>
        <div class="body">
          <br><h5>A link for a contract will be sent to ${values.email}</h5><br>
        </div>
      `;
      prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content });
      btnLoader(e.target, false);
    });
  }

  if (addon) {
    if (addon.length > 0) {
      addon.forEach(a => a.addEventListener('click', (elem) => {
        let tagsArray = addon_tags.value.split(',');
        tagsArray = tagsArray.filter(e => e !== '');
        if (elem.target.checked) {
          tagsArray.push(elem.target.dataset.tag);
        } else {
          tagsArray = tagsArray.filter(e => e !== elem.target.dataset.tag);
        }
        addon_tags.value = tagsArray.toString();
      }));
    }
  }
  
  if (owner) {
    let no = document.querySelector('.shopping-cart #owner_no');
    let yes = document.querySelector('.shopping-cart #owner_yes');
    let access = document.querySelector('[name="property_access"]');
    owner.forEach(a => {
      a.addEventListener('click', (e) => {
        if (e.target.checked) {
          no.style.display = e.target.value === "false" ? 'flex' : 'none';
          if (e.target.value === "true") {
            yes.style.display = 'block';
            access.required = true;
          } else {
            yes.style.display = 'none';
            access.required = false;
          }
        }
      });
    });
  }
  
  if (curPg.includes('contract')) {
    let ifsEm = {
      email: email.value
    }
    let ifs = await infusionsoftSubmit(ifsEm);
    let ifs_id = document.querySelectorAll('.shopping-cart [name=ifs_lead_id]');
    for (let i of ifs_id) i.value = ifs.contact.id;
  }

  if (email) {
    email.addEventListener('change', async () => {
      if (!email.validity.valid) {
        email.insertAdjacentHTML("afterend", `
          <small style="color:red;" class="lookupstatus">${email.validationMessage}</small>
        `);
        return false;
      }
      let ifsData = {
        email: email.value,
        utm_source: document.querySelector('.shopping-cart [name=utm_source]').value,
        utm_adgroup: document.querySelector('.shopping-cart [name=utm_adgroup]').value,
        utm_campaign: document.querySelector('.shopping-cart [name=utm_campaign]').value,
        utm_medium: document.querySelector('.shopping-cart [name=utm_medium]').value,
        utm_term: document.querySelector('.shopping-cart [name=utm_term]').value,
        utm_content: document.querySelector('.shopping-cart [name=utm_content]').value,
        source_page: document.querySelector('.shopping-cart [name=source_page]').value,
        sales_rep: document.querySelector('.shopping-cart [name=sales_rep]').value,
        workbook_id: document.querySelector('.shopping-cart [name=workbook_id]').value
      }
      let ifs = await infusionsoftSubmit(ifsData);
      let ifs_id = document.querySelectorAll('.shopping-cart [name=ifs_lead_id]');
      for (let i of ifs_id) i.value = ifs.contact.id;
    });
  }

  if (curPg.includes('sales-entry') || curPg.includes('access')) {
    agileSubmit.addEventListener('click', newRepToken);
  }
});
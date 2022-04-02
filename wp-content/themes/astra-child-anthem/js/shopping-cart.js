document.addEventListener("DOMContentLoaded", async () => {
  // VARIABLES
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
      opportunity_stage: data.opportunity_stage,
      sales_source: data.sale_source,
      product_line: data.product_line,
      packages: []
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
  const workbook = async (token, data) => {
    let api = {
      url: `${agileUrl}sales/save_workbook/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify(data)
    }
    return await ajax(api).then(res => res);
  }
  const onTabChange = async (data, elem, curTab) => {
    btnLoader(elem, true);
    let stat = document.querySelector('.shopping-cart .controller .status');
    let thisTab = {};
    let token = await getToken();
    
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
      let wb = await workbook(token, wbOb);
      console.log(wb);
      if (![200, 201, 202].includes(wb.status)) {
        if (wb.detail) {
          stat.innerHTML = `<div class="warning">${wb.detail}</div>`;
        }
        btnLoader(elem, false);
        return false;
      }
      wbOb.workbook_id = parseInt(wb.result.workbook_id);
      console.log(`Agile: #${wb.result.workbook_id} #${wb.request.workbook_id} - Contact ${wb.detail}`);
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
      let wbPack = await workbook(token, wbOb);
      console.log(wbPack);
      console.log(`Agile: #${wbPack.result.workbook_id} #${wbPack.request.workbook_id} - Package ${wbPack.detail}`);
      if (![200, 201, 202].includes(wbPack.status)) {
        if (wbPack.detail) {
          stat.innerHTML = `<div class="warning">${wbPack.detail}</div>`;
        }
        return false;
      }
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
      let wbNotes = await workbook(token, wbOb);
      if (![200, 201, 202].includes(wbNotes.status)) {
        console.log(wbNotes);
        if (wbNotes.detail) {
          stat.innerHTML = `<div class="warning">${wbNotes.detail}</div>`;
        }
        btnLoader(elem, false);
        return false;
      }
      console.log(`Agile: #${wbNotes.result.workbook_id} #${wbNotes.request.workbook_id} - Notes ${wbNotes.detail}`);
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
  const initShopCartForm = async (firstTry=true) => {
    let shop = document.querySelector('.shopping-cart');
    if (shop) {
      setTimeout(() => loadPackages(), 500);
      form(shop, onTabChange).then( async val => {
        mainBtn.innerHTML = loader;
        mainBtn.disabled = true;
        let token = await getToken();
        let i = values;

        let or = '';

        let api = {
          url: `${agileUrl}sales/make_sale/`,
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
          body: JSON.stringify({workbook_id: values.workbook_id})
        }
        let saleCompleted = await ajax(api).then(res => res);
        let p = saleCompleted;
        console.log(`Agile: #${p.request.workbook_id} #${p.result.workbook_id} - ${p.detail}`);

        mainBtn.innerHTML = temp;
        mainBtn.disabled = false;
        
        let records = ``;
        if (curPg.includes('sales-entry') && curPg.includes('access')) {
          let o = saleCompleted.result;
          let e = `https://agileisp.com/?`;
          let u = `https://vx952.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=`
          records = `
            Workorder Number: <a href="${e}s=wo&p=edit&pk=${o.workorder_id}&o=5" target="_blank"> 
              #${o.workorder_id}
            </a><br>
            Workbook Number: <a href="${e}o=5&s=sales&p=workbook&id=${o.workbook_id}" target="_blank"> 
              #${o.workbook_id}
            </a><br>
            Keap id: <a href="${u}${i.ifs_lead_id}" target="_blank"> 
              #${i.ifs_lead_id}
            </a><br>
          `;
        } else {
          records = `
            Workorder Number: #${saleCompleted.result.workorder_id}<br>
            Workbook Number: #${saleCompleted.result.workorder_id}<br>
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
  const btnLoader = (elem, state) => {
    if (state) {
      elem.setAttribute("data-html", elem.innerHTML);
      elem.innerHTML = '<div class="loader"></div>';
      elem.disabled = true;
    } else {
      elem.innerHTML = elem.getAttribute("data-html");
      elem.disabled = false;
    }
  }
  
  // FUNTIONS
  // let token = await getToken();

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

  if (sendContract) {
    sendContract.addEventListener('click', async (e) => {
      e.preventDefault();
      values.tags ? values.tags += ',366' : values.tags = '366';
      let ifs = await infusionsoftSubmit(values);
      let content = `
        <h2 class="heading flex-center">SUCCESS</h2>
        <div class="body">
          <br>
          <h5>A link for a contract will be sent to ${values.email}</h5>
          <br>
        </div>
      `;
      prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content });
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
        sales_rep: document.querySelector('.shopping-cart [name=sales_rep]').value
      }
      
      let ifs = await infusionsoftSubmit(ifsData);
      let ifs_id = document.querySelectorAll('.shopping-cart [name=ifs_lead_id]');
      for (let i of ifs_id) i.value = ifs.contact.id;
    });
  }

  if (zone_status) {
    let url = newUrl.get('status');
    if (url) {
      let cap = url.charAt(0).toUpperCase() + url.slice(1);
      zone_status.innerHTML = cap;
    }
  }
});
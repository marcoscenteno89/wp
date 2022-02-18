const mainBtn = document.querySelector('#btn');	
const temp = mainBtn ? mainBtn.innerHTML : null;
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
    if (res.contact) {
      let i = res.contact;
      if (i.id) values.ifs_lead_id = i.id;
    }  
    return res;
  });
}
const agileSubmit = async (token, a) => {
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
const loadPackages = async () => {
  let token = await getToken();
  let api = {
		url: `${agileUrl}sales-package/?o=5&html=false`,
		method: 'GET',
		headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`})
	}
  await ajax(api).then(res => {
    let pack = res.data.filter(i => {
      return i.product_category__name === 'Fiber' && i.product_line__name === 'Residential' && i.id !== 68;
    });
    let cell = '';
    for (let i = 0; i < 9; i++) cell += '<div class="w-cell"></div>';

    let container = document.querySelector('.shopping-cart .packages');
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
          <div class="container">
            <div data-accordion="accordion" style="min-height:22px;">
              <button data-accordion="head" class="show-content">
                <span class="arr">&#10095; </span> Plan Details
              </button>
              <div data-accordion="body" class="din-content"><hr>
              <p>Speed: ${i.speed}</p>
              <p>${i.long_description}</p>
              </div>
            </div>
          </div>
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
  });
}  
const workbook = async (token, data) => {

  let body = {  
    o: 1,
    external_lead_id: "314348",
    source_value: "ifs",
    contact_id: 0,
    contact_info: {
      first_name: data.given_name,
      last_name: data.family_name,
      service_address: {
        id: "0",
        street: data.line1,
        line2: "",
        city: data.locality,
        state: data.region,
        postalcode: data.postal_code
      },
      email_list: [{ id: "0", data: data.email }],
      phone_list: [{ id: "0", data: data.phone }]
    },
    opportunity_stage: 281,
    opportunity_notes: "",
    sales_notes: "",
    sales_source: data.sale_source
  }

  console.log(body);

  let api = {
    url: `${agileUrl}sales/save_workbook/`,
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
    body: JSON.stringify(body),
    report: true
  }
  // return await ajax(api).then(res => res);
}
const onTabChange = async data => {
	let thisTab = {};
	mainBtn.innerHTML = loader;
	mainBtn.disabled = true;
  data.forEach(i => {
    if (i.field.type === 'checkbox') {
      thisTab[i.field.name] = i.value === '' ? 'false' : i.value;
    } else {
      thisTab[i.field.name] = i.value;
    }
  });
  if (thisTab.agile_contact) {
    let token = await getToken();
    let wb = await workbook(token, thisTab);
    console.log(wb);
    // let ifs = await infusionsoftSubmit(thisTab);
    // if (ifs.contact) thisTab.ifs_lead_id = ifs.contact.id;
    // let agileSearch = await agileLookup(token, thisTab);
    // thisTab = agileSearch.data;
    // let agileContact = await agileSubmit(token, thisTab);
    // if (values.create_account === true) {
    //   if (agileContact.account) thisTab.account_id = agileContact.account.id;
    //   if (agileContact.contact) thisTab.contact_id = agileContact.contact.id;
    // }
    // let i = thisTab;

    if (document.querySelector('#vac')) {
      let vac = document.querySelector('#vac');
      vac.innerHTML = `${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}`;
    } 
    for (let fi of document.querySelectorAll('[name="email"]')) {
      if (fi.type === 'hidden') fi.value = thisTab.email;
    }
    delete thisTab.agile_contact;
    delete thisTab.tags;
  }
  if (thisTab.agile_schedule) {
    let token = await getToken();
    let schedule = await agileScheduleLookup(token, thisTab.contact_id);
    getSchedule(values.availability);
    delete values.agile_schedule;
  }
	if (thisTab.package) {
		values.products.push(parseInt(thisTab.package));
		delete thisTab.package;
	}
	if (thisTab.tags) {
		if (thisTab.tags !== '') {
			let addons = await infusionsoftSubmit({email:thisTab.email, tags: thisTab.tags});	
		}
		delete thisTab.tags;
	}
	for (let key in thisTab) values[key] = thisTab[key];
	mainBtn.disabled = false;	
}
const verifyAddress = async (firstTry=true) => {
  if (document.querySelector('.shopping-cart')) {
    loadPackages();

    form(document.querySelector('.shopping-cart'), onTabChange).then( async val => {
      mainBtn.innerHTML = loader;
      mainBtn.disabled = true;
      let token = await getToken();
      let ifs = await infusionsoftSubmit(values);
      let i = values;
      let or = '';
      if (ifs.order.order_items) {
        for (let e of ifs.order.order_items) or += `$${e.price} ${e.name}<br>`;
      }
      values.notes = `
        Agreed to Terms & Conditions: ${i.terms_conditions === 'true' ? true : false}
        Agreed to Give Property Access: ${i.property_access === 'true' ? true : false}
        Property Owner: ${i.own_location === 'true' ? true : false}
        Nid Location: ${i.nid_location}
        Agreed that this is a legal Signature: ${i.legal_signature === 'true' ? true : false}
        Customer requires to be at home during installation: ${i.installation_notification === 'true' ? true : false}
        ${i.notification_email ? '<br>Notification Email: ' + i.notification_email : '<br>'}
        Customer Signature: ${i.customer_signature}
        Products:<br>
        ${or}
      `;
      let agileWo = await scheduleWo(token, values);
      //let agilewb = await workbook(token, values);
      mainBtn.innerHTML = temp;
      mainBtn.disabled = false;			
      let content = `
        <h2 class="heading flex-center">SUCCESS</h2>
        <div class="body">
        <h4>Data submitted successfully</h4>
        Name: ${i.given_name} ${i.family_name}<br>
        Phone: ${i.phone}<br>
        Email: ${i.email}
        ${i.notification_email ? '<br>Notification Email: ' + i.notification_email : '<br>'}
        Work Order: #${agileWo.workorder.id}<br>
        Service Address: ${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}<br>
        Nid Location: ${i.nid_location}<br>
        Agreed to Terms & Conditions: ${values.terms_conditions === 'true' ? 'yes' : 'no'}<br>
        Agreed to Give Property Access: ${values.property_access === 'true' ? 'yes' : 'no'}<br>
        Property Owner: ${values.own_location === 'true' ? 'yes' : 'no'}<br>
        Agreed that this is a legal Signature: ${values.legal_signature === 'true' ? 'yes' : 'no'}<br>
        Customer requires to be at home during installation: ${values.installation_notification === 'true' ? 'yes' : 'no'}<br>
        Products:<br>
        ${or}
        </div>
      `;
      prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content });
      values.comments = `Work Order: #${agileWo.workorder.id}`;
      delete values.notes;
      let ifs2 = await infusionsoftSubmit(values);
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

document.addEventListener("DOMContentLoaded", () => {
  // VARIABLES
  const sendContract = document.querySelector('#send_contract');
  const propertyAccess = document.querySelector('#property_access');
  const ownLocation = document.querySelector('#own_location');

  let newUrl = new URLSearchParams(window.location.search);
  let Shop = document.querySelector('.shopping-cart');
  let owner = document.querySelectorAll('.shopping-cart [name="own_location"]');
  let zone_status = document.querySelector('.zone_status');
  let addon = document.querySelectorAll('.addon');
  let addon_tags = document.querySelector('.addontags');
  let email = document.querySelector('.lookup');
  
  // FUNTIONS
  verifyAddress();
  // woLookup();
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
      addon.forEach(a => a.addEventListener('click', () => {
        let tagsArray = addon_tags.value.split(',');
        tagsArray = tagsArray.filter(e => e !== '');
        if (this.checked) {
          tagsArray.push(this.dataset.tag);
        } else {
          tagsArray = tagsArray.filter(e => e !== this.dataset.tag);
        }
        addon_tags.value = tagsArray.toString();
      }));
    }
  }
  
  if (owner.length > 0) {
    owner.forEach(a => {
      a.addEventListener('click', (e) => {
        let no = document.querySelector('.shopping-cart #owner_no');
        let yes = document.querySelector('.shopping-cart #owner_yes');
        if (e.target.checked) {
          no.style.display = e.target.value === "false" ? 'flex' : 'none';
          if (e.target.value === "true") {
            yes.style.display = 'block';
            propertyAccess.required = true;
          } else {
            yes.style.display = 'none';
            propertyAccess.required = false;
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

      // let contact = await keapLookup(email.value);
      // console.log(contact);
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
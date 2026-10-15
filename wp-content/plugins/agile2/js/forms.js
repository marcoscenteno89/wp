/* 
  Description: This file contains helper functions and constant variables 
  Author: Marcos Centeno
  Version: 1.0
*/

document.addEventListener("DOMContentLoaded", async () => {
  // VARIABLES
  const exists = [''.trim(), undefined, null, false, 'null'];
  const valid_phone = (x) => x.replace(/[^0-9]/g, '');
  const curPg = window.location.pathname;
  const hasProp = (obj) => Object.entries(obj).length > 0;
  // const agileLogin = ;
  const msgError = (msg, width) => {
    return `<div class="msg warning" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
  }
  const msgSuccess = (msg, width) => {
    return `<div class="msg success" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
  }
  const msgGeneric = (msg, width) => {
    return `<div class="msg generic" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
  }
  // localStorage.setItem("agileAdmin", agileLogin ? true : false);
  const checkAddressForm = document.querySelector('.check-address');
  const checkWoForm = document.querySelector('.check-wo');
  // CLASSES

  class Form {
    constructor(form, formCompletedCallback, tabChangeCallback=false) {
      this.form = form;
      this.tabChangeCallback = tabChangeCallback;
      this.formCompleteCallback = formCompletedCallback;
      this.status = form.querySelector(".status");
      this.tabList = [];
      this.values = {}
      this.currentTab = 0;
      this.previousTab;
      this.next = form.querySelector('button[name="next"]');
      this.previous = form.querySelector('button[name="prev"]');
    }
  
    validateData() {
      let fieldList = this.tabList[this.currentTab].tab.querySelectorAll('.form-input');
      this.tabList[this.currentTab].valid = true; // RESET TAB VALIDITY
      this.status.innerHTML = '';
      let msg = '';
      let issues = 0;
      fieldList.forEach(field => {
        if (field.type !== 'hidden') {
          if (field.validity.valid) {
            field.classList.add('success');
          } else {
            issues++;
            field.classList.add('warning');
            msg += `<div>${field.getAttribute('placeholder')}: ${field.validationMessage}</div>`;
          }
        }
      });
      if (issues > 0) {
        this.tabList[this.currentTab].valid = false;
        this.status.innerHTML = msgError(msg);
        return false;
      }
      fieldList.forEach(field => {
        this.values[field.name] = field.value;
        this.tabList[this.currentTab].values[field.name] = field.value;
      });
    }
  
    showNewTab() {
      this.tabList[this.currentTab].tab.style.display = "flex";
      this.next.setAttribute("data-step", this.currentTab + 1); 
    
      if (this.previous) {
        this.previous.disabled = (this.currentTab === 0) ? true : false;
        this.previous.setAttribute("data-step", this.currentTab - 1);
      }
  
      if (this.tabList.length > 1) {
        let last = this.tabList.length - 1;
        let next = this.next;
        next.innerHTML = this.currentTab === last ? 'Submit' : next.getAttribute('data-text');
      }
      
      if (this.tabList[this.currentTab].step) {
          this.tabList[this.currentTab].step.classList.add('active');
      }
    }
  
    clearPreviousTab() {
      if (this.tabList[this.previousTab]) {
        this.tabList[this.previousTab].step.classList.remove('active');
        this.tabList[this.previousTab].step.classList.add('completed');
        this.tabList[this.previousTab].tab.style.display = 'none';
      }
    }
  
    async changeTab(event) {
      btnLoader(this.next, true);
      let nextStep = parseInt(event.target.getAttribute('data-step'));
      if (this.currentTab < nextStep) {
        this.validateData();
      }
      if (!this.tabList[this.currentTab].valid) {
        btnLoader(this.next, false);
        return false;
      }
      if (nextStep >= this.tabList.length) {
        await this.formCompleteCallback(this, this.values);
        btnLoader(this.next, false);
        return false;
      }
      if (this.tabChangeCallback) {
        await this.tabChangeCallback(this, this.tabList[this.currentTab].values);
      }
      
      this.previousTab = this.currentTab;
      this.currentTab = nextStep;
      this.clearPreviousTab();
      this.showNewTab();
      btnLoader(this.next, false);
    }
  
    init() {
      let tabListNode = this.form.querySelectorAll(".tab");
      this.next.setAttribute('data-text', this.next.innerHTML);
      tabListNode.forEach( (tab,i) => {
        let stringProps = tab.getAttribute("data-props");
        if (stringProps) {
          let props = JSON.parse(stringProps);
          tab.id = `id-${props.name.toLowerCase().replace(' ', '-')}`;
          this.tabList.push({
            valid: true,
            index: i,
            name: props.name,
            tab: tab,
            properties: props,
            values: {}
          });
          let width = `style="flex: 0 1 ${100 / tabListNode.length}%;"`;
          this.form.querySelector('.steps').insertAdjacentHTML("beforeend", `
            <div ${width} class="step step-${i} flex-col" data-step="${i}">
              <span class="number">${i + 1}${ props.name ? `</span>
              <span class="title">.${props.name.toUpperCase()}` : ''}</span>
            </div>
          `);
        }
      });
      // SETUP EVENT LISTENERS
      this.form.querySelectorAll('.step').forEach((step, i) => {
        this.tabList[i].step = step;
        step.addEventListener('click', (event) => this.changeTab(event));
      });
      
      this.next.addEventListener('click', (event) => this.changeTab(event));
      if (this.previous) {
        this.previous.addEventListener('click', (event) => this.changeTab(event));
        this.previous.style.width = '50%';
        this.next.style.width = '50%';
      }
      this.showNewTab(this.currentTab);
    }
  }
  class Limiter {
    constructor(elem, status) {
      this.target = elem;
      this.disabled = false;
      // this.on = true; // SET THIS TO FALSE IF YOU WANT TO TURN OFF LIMITER
      this.now = new Date();
      this.expiration = false;
      this.id = elem.getAttribute('data-limit-id');
      this.min = parseInt(elem.getAttribute('data-limit-min'));
      this.hr = parseInt(elem.getAttribute('data-limit-hr'));
      this.day = parseInt(elem.getAttribute('data-limit-day'));
      this.count;
      this.countLimit = parseInt(elem.getAttribute('data-limit-count'));
      this.status = status;
    }

    init() {
      if (storageAvailable('localStorage')) {
        let jsonData = localStorage.getItem(`agile_${this.target.getAttribute('data-limit-id')}`);
        if (jsonData) { // USE EXISTING DATA 
          this.dataExists(JSON.parse(jsonData));
        } else { // NO DATA AVAILABLE, CREATE NEW ENTRY
          this.resetLimit();
        }
        if (this.disabled) {
          if (this.now > this.expiration) {
            this.resetLimit();
          } else {
            this.currentlyDisabled();
            return false;
          }
        }
        if (this.count >= this.countLimit) {
          this.disableTarget();
          this.currentlyDisabled();
          return false;
        } else {
          this.count = this.count + 1;
        }
        let label = this.id.replace('_', ' ');
        console.log(`You can try ${label} ${this.countLimit - this.count} more times.`);
        this.save();
      } else {
        console.log('localStorage not available');
      }
    }

    dataExists(data) {
      this.count = data.count;
      this.disabled = data.disabled;
      this.expiration = data.expiration ? new Date(data.expiration) : false;
    }

    save() {
      localStorage.setItem(`agile_${this.id}`, JSON.stringify({
        count: this.count,
        disabled: this.disabled,
        expiration: this.expiration
      }));
    }

    disableTarget() {
      this.expiration = new Date();
      if (this.min > 0) this.expiration.setMinutes( this.now.getMinutes() + this.min );
      if (this.hr > 0) this.expiration.setHours( this.now.getHours() + this.hr);
      if (this.day > 0) this.expiration.setHours( this.now.getHours() + (this.day * 24));
      this.target.disabled = true;
      this.disabled = true
    }

    resetLimit() {
      this.count = 0;
      this.disabled = false;
      this.target.disabled = false;
      this.expiration = false;
    }

    currentlyDisabled() {
      let totalMin = Math.floor(((this.expiration - this.now) / 1000) / 60);
      let day = Math.floor(totalMin / 1440);
      let dayRemainder = totalMin % 1440;
      let hr = Math.floor(dayRemainder / 60);
      let hrRemainder = dayRemainder % 60;
      let min = hrRemainder % 60;
      let dayTemp = day > 0 ? `${day} day${day > 1 ? 's' : ''}${hr > 0 ? ',' : ''}` : '';
      let hrTemp = hr > 0 ? `${hr} hour${hr > 1 ? 's' : ''}` : '';
      let minTemp = '';
      if (min > 0) {
        minTemp = `${hr > 0 || day > 0 ? ' and' : ''} ${min} minute${min > 1 ? 's' : ''}`;
      } else {
        minTemp = '';
      }
      this.target.disabled = true;
      this.status.innerHTML = msgError(`
        Limit of uses reached. Try again in ${dayTemp} ${hrTemp} ${minTemp}.
      `);
    }
  } 
  class Agile {
    constructor() {
      this.url = 'https://agileisp.com/api/';
      this.token = localStorage.getItem('agile_token');
      this.autoLogin = false;
      this.tokenVerified = false;
      this.loginBg = document.querySelector('.login-bg');
      this.loginForm = document.querySelector('.check-login');

      // AGILE DATA
      this.email_preference = false;
      this.sms_preference = false;
      this.update_existing = true;
      this.same_billing = true;
      this.create_account = a.create_account;
      this.service_street = a.line1;
      this.service_street2 = '';
      this.service_city = a.locality;
      this.service_state = a.region;
      this.service_zip = a.postal_code;
      this.email = a.email;
      this.phone = a.phone;
      this.first_name = a.given_name;
      this.last_name = a.family_name;
      this.org_id_list = [5]
    }
    init() {
      this.getToken();
    }

    request(endpoint, method, body=false, auth=false) {
      let headers = { 'Content-Type': 'application/json; charset=utf-8' }
      if (auth) headers['Authorization'] = `JWT ${this.token}`
      let api = {
        url: `${this.url}${endpoint}`,
        headers: new Headers(headers),
        method: method
      }
      if (body) api.body = JSON.stringify(body);
      return ajax(api).then( res => res ); 
    }
    verifyToken() {
      let verified = this.request('auth-token/verify/', 'POST', {token: this.token}, false);
      return verified.token ? true : false;
    }
    refreshToken() {
      return this.request('auth-token/refresh/', 'POST', {token: this.token}, false);
    }
    requestNewToken() {
      if (this.autoLogin) {
        // GET TOKEN FROM SERVER
        // USE CREDENTIALS STORED ON DB
      } else {
        // USER LOGIN
       this.login();
      }
    }
    requestTokenFromServer() {

    }
    updateTokenOnDB() {
      let api = {
        body: `action=agile_token&token=${token}`,
        method: 'POST',
        url: agile_token.ajax_url
      }
      return ajax(api).then(res => {
        localStorage.setItem("agile_token", res.token);
        return res.token;
      });
    }
    async getToken() {
      // If token is null request brand new token
      if (!exists.includes(this.token)) {
        // check if agile token is valid. 
        let verified = await this.verifyToken();
        if (!verified) {
          // Attempt to refresh token if no longer valid
          let refreshed = await this.refreshToken();
          if (refreshed.token) {
            this.token = refreshed.token;
            localStorage.setItem("agile_token", this.token);
          } else {
            this.requestNewToken();
          }
        } 
      } else {
        this.requestNewToken();
      }
    }
    checkList (val) {
      let params = new URLSearchParams(val);
      let endpoint = `workorder/get_fiber_checklist/?${params.toString()}`; 
      return this.request(`${endpoint}${urlVar}`, 'GET', false, true);
    }
    login() {
      const formCallback = async (form, val) => {
        let attempt = await this.request('auth-token/', 'POST', val, false);
        if (!attempt.ok) {
          let status = '';
          for (let i of attempt.non_field_errors) status += `<div>${i}</div>`;
          form.status.innerHTML = msgError(status);
          return false;
        }
        return new Promise( async (resolve) => {
          this.loginBg.style.display = 'none';
          this.token = loggedinAttempt.token;
          localStorage.setItem("agile_token", this.token);
          resolve(true);
        });
      }
      const checkLogin = new Form(this.loginForm, formCallback);
      checkLogin.init();
      this.loginBg.style.display = 'flex';
      return false;
    }
    widthinZone(val) {
      val.address = `${val.line1}, ${val.locality}, ${val.region} ${val.postal_code}`;
      let params = new URLSearchParams(val);
      params.delete('project_id'); // Issue in agile when stringifying project_id
      let endpoint = `fiber-tool/zone_status/?${params}&project_id=${val.project_id}`;
      return this.request(endpoint, 'GET', false, true);
    }
    async makeSale(workbook_id, elem) {
      let recursiveCnt = 0;
      let val = {
        workbook_id: workbook_id
      }
      let attempt = await this.request('sales/make_sale/', 'POST', val, false, true);
      if (attempt.status === 500 && recursiveCnt < 4) {
        console.log(`Error ${res.status} - Trying again in 5 seconds, try #${recursiveCnt++}`);
        var timeout = setTimeout( async () => await makeSale(workbook_id, elem), 5000);
      } else {
        clearTimeout(timeout);
        return attempt;
      }
    }
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
  const storageAvailable =(type) => {
    try {
      var storage = window[type];
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) {
      return false;
    }
  }
  const ajax = (api, callback=false) => {
    if (!api.method) api.method = 'GET';
    if (!api.credentials) api.credentials = 'same-origin';
    if (!api.headers) api.headers = new Headers({ 
      'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' 
    });
    let tmp;
    return fetch(api.url, api).then(res => {
      tmp = res.ok;
      return api.res ? res.text() : res.json();
    }).then(data => {
      if (!tmp) console.log(data, api);
      data.ok = tmp;
      return data;
    }).catch(err => {
      console.log(err, api);
    });
  }

  // AGILE SCRIPTS

  const loadPackages = async () => {
    const token = await getToken();
    if (exists.includes(localStorage.getItem("agilePackages"))) {
      if (token) {
        const packages = {
          commercial: {},
          residential: {}
        }
        setTimeout( async () => {
          let api = {
            url: `${agileUrl}sales-workbook/get_choices/?o=1&choice_set=packages&return_dates=false`,
            method: 'GET',
            headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`})
          }
          await ajax(api).then(res => {
            if ([200, 201, 202, 203].includes(res.status)) {
              let m = res.result.choices.packages;
              packages.commercial.wireless = m.filter(i => i.cat_id === 4 && i.prod_line_id === 84);
              packages.commercial.fiber = m.filter(i => i.cat_id === 5 && i.prod_line_id === 84);
              packages.residential.fiber = m.filter(i => i.cat_id === 2 && i.prod_line_id === 83);
              packages.residential.wireless = m.filter(i => i.cat_id === 1 && i.prod_line_id === 83 && i.id !== 2);
              packages.residential.carey = m.filter(i => i.group_name === 'Carey');
              packages.commercial.carey = packages.residential.carey;
            } else {
              console.log(`Agile: ${res.detail}`);
            }
          });
          api.url = `${agileUrl}sales-workbook/get_choices/?o=5&choice_set=packages&return_dates=false`;
          await ajax(api).then(res => {
            if ([200, 201, 202, 203].includes(res.status)) {
              let m = res.result.choices.packages;
              packages.residential.elko = m.filter(i => i.cat_id === 2 && i.prod_line_id === 83 && i.id !== 68);
              packages.commercial.elko = m.filter(i => i.cat_id === 5 && i.prod_line_id === 84);
            } else {
              console.log(`Agile: ${res.detail}`);
            }
          });
          if (hasProp(packages.commercial) && hasProp(packages.residential)) {
            localStorage.setItem("agilePackages", JSON.stringify(packages));
          }
        }, 1000);
        console.log('Packages Data Loaded...');
      }
    } else {
      console.log('Packages Data Already Exists...');
    }
  }
  const packAnim = (cell, percent) => {
    return `<div class="anim-container">
      <div class="anim">${cell}</div>
      <div class="hide" style="left:${percent}%"></div>
    </div>`;
  }
  const singlePackageTemplate = (animation, i, active, templateId, dbtn, container) => {
    let innerContent = '';
    let products = '';

    if (i.products.length > 0) {
      for (let o of i.products) products += `<small style="font-size:0.8rem;">${o.name}</small>`
    }
    let accordion = `<details style="color:#fff;">
      <summary>Details</summary>
      <div class="details-body">${products}<div>
    </details>`;
    
    let temp2Content = `
      <h5 class="title flex-center" style="justify-content:flex-start;">${i.name}</h5>
      ${animation}
      <h3 class="amount flex-center" style="justify-content:flex-end;">$${i.price}</h3>
      <div class="action flex-center" data-id="id-${i.id}" data-html="Select">Select</div>
    `;
    
    let temp1Content = `
      <h3 class="amount" style="color:#fff;">$${i.price}</h3>
      ${animation}   
      <h3 class="title flex-center">${i.name}</h3>
      <h5 style="color:#fff;">${i.speed}*</h5>
      ${accordion}
      <div class="action" data-id="id-${i.id}" data-html="${dbtn}">${dbtn}</div>
      
      ${i.id === active ? '<div class="main">MOST POPULAR</div>' : ''}
    `;
    
    if (templateId === 1) {
      innerContent = temp1Content;
    } else if (templateId == 2) {
      innerContent = temp2Content;
    } else {}
    container.insertAdjacentHTML("beforeend", `
      <input type="radio" data-price="${i.price}" placeholder="Package" class="form-input" name="package" value="${i.id}" id="id-${i.id}">
      <label for="id-${i.id}" class="paq ${i.id === active ? 'active' : ''}">${innerContent}</label>
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
  const getPackages = (pProductLine=false, pType=false) => {
    const packages = JSON.parse(localStorage.getItem("agilePackages"));
    const containerList = document.querySelectorAll('[data-packages]');
    let cell = '';
    for (let i = 0; i < 9; i++) cell += '<div class="w-cell"></div>';

    for (let container of containerList) {
      container.innerHTML = '';
      const type = pType ? pType : container.getAttribute('data-type');
      const productline = pProductLine ? pProductLine : container.getAttribute('data-productline');
      const dbtn = container.getAttribute('data-btn') ? container.getAttribute('data-btn') : 'Select';
      if (packages) {
        let pack = packages[productline][type].sort((a, b) => a.price - b.price);
        let percent = 0;
        let active = pack[pack.length - 2].id;
        let templateId = parseInt(container.getAttribute('data-template'));
        for (let i of pack) {
          percent = percent + (100 / pack.length);
          let animation = packAnim(cell, percent);
          singlePackageTemplate(animation, i, active, templateId, dbtn, container);
        }
      }
    }
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
  const agileCreateContact = async (a, elem, label) => {
    let token = await getToken();
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
      org_id_list: [5]
    }
    if (a.account_id) body.account_id = a.account_id;
    if (a.contact_id) body.contact_id = a.contact_id;
    let api = {
      url: `${agileUrl}contact/`,
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      method: 'POST',
      body: JSON.stringify(body)
    }
    return await ajax(api).then(res => {
      showStatus(res, elem, label);
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  const createWo = async (a, elem, label) => {
    let token = await getToken();
    let api = {
      url: `${agileUrl}workorder/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify({
        contact_id: parseInt(a.contact_id),
        account_id: parseInt(a.account_id),
        product_line_id: a.product_line === 'Residential' ? 83 : 84,
        type_id: 1082,
        workorder_org_id_list: [5],
        o: a.o,
        notes: a.notes,
        sales_user_id: parseInt(localStorage.getItem("agileRepId"))
      })
    }
    return await ajax(api).then(res => {
      showStatus(res, elem, label);
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  const generateWoObj = (data) => {
    let ob = { 
      o: data.o,
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
      obo_sales_user_id: parseInt(localStorage.getItem("agileRepId")),
      original_salesperson_id: parseInt(localStorage.getItem("agileRepId")),
      packages: [],
      due_on_install: 0
    }
    if (data.sales_source !== '' && data.sales_source) {
      ob.sales_source = data.sale_source;
    }
    if (data.contact_id !== '' && data.contact_id) {
      ob.contact_id = data.contact_id;
    }
    if (data.account_id !== '' && data.account_id) {
      ob.account_id = data.account_id;
    }
    if (data.workorder_id !== '' && data.workorder_id) {
      ob.workorder_id = data.workorder_id;
    }
    if (data.workbook_id !== '') {
      ob.workbook_id = data.workbook_id;
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
      showStatus(res, elem, label, false);
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  const workorderToWb = async(a, elem, label) => {
    let token = await getToken();
    let data = {
      o: a.o,
      workorder_id: a.workorder_id,
      sales_source_id: a.sale_source,
      packages: a.packages
    }
    let api = {
      url: `${agileUrl}sales/workorder_to_wb/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify(data)
    }
    return await ajax(api).then(res => {
      showStatus(res, elem, label, false);
      return [200, 201, 202].includes(res.status) ? res : false;
    });
  }
  
  const woLookup = async (term, org) => {
    let token = await getToken();
    if (token) {
      let api = {
        url: `${agileUrl}workorder/list_view/`,
        headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
        method: 'POST',
        body: JSON.stringify({
          wo_text_search: term,
          o: org,
          html: false
        })
      }
      return ajax(api).then(res => {
        let header = [];
        for (let o of res.data[0]) header.push(o.replace(/\s/g, '_').toLowerCase());
        let woList = []
        for (let i = 1; i < res.data.length; i++) {
          let wo = res.data[i];
          let cur = {}
          for (let e = 0; e < wo.length; e++) {
            cur[header[e]] = wo[e];
          }
          woList.push(cur);
        }
        return woList.filter( i => i.status !== "Cancelled" && i.type === "Anthem Fiber Drop");
      });
    } else {
      return [];
    }
  }
  const woExistsPrompt = (wo) => {
    let x = wo.length > 1;
    let body = ``;
    for (let i of wo) {
      let admin = ''
      if (localStorage.getItem("agileAdmin") === 'true') {
        admin += ` <a class="btn yellow" href=${agile}?s=wo&p=edit&o=5&pk=${i['wo#']}> 
          Agile Wo #${i['wo#']}
        </a>`;
      }
      body += `<div class="flex-row" style="padding-bottom:1rem;">
        <div style="width:50%;">
          <strong>${i.service_street}, ${i.service_city}, ${i.service_postal_code}</strong><br>
          Created On ${i.created_date}
        </div>
        ${admin}
        
      </div>`;
    }
    let s = `We already have ${x ? 'Work Orders' : 'a Work Order'} for the following address${x ? 'es' : ''}`;
    let content = `
      <h3 class="heading flex-center">${s}</h3>
      <div class="body">
        ${body}
      </div>
      <div class="footer primary flex-col" style="padding:1rem;">
        <p style="color:#fff;">
          <strong>To make changes to order, please contact a customer service rep at 
          <a class="btn white" href="tel:+17753892892">775.389.2892</a></strong><br>
          <strong>To continue placing a new order, click below.</strong>
        </p>
        <button class="btn secondary closebt">Begin New Order</button>
      </div>
    `;
    prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content });
    let bg = document.querySelector('#background');
    bg.querySelector('.closebt').addEventListener('click', () => {
      bg.classList.add('hidden');
      bg.innerHTML = '';
    });
  }

  // END OF AGILE SCRIPTS

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
  const showStatus = (p, btn, label) => {
    let stat = document.querySelector('.controller .status');
    if (![200, 201, 202].includes(p.status)) {
      if (p.detail) {
        stat.innerHTML = `<div class="warning">${p.detail}</div>`;
        console.log(p.detail);
      }
      btnLoader(btn, false);
    } else {
      if (p.request.workbook_id) {
        console.log(`Agile: #${p.request.workbook_id} #${p.result.workbook_id} - ${label} ${p.detail}`);
      } else {
        console.log(`${label} ${p.detail ? p.detail : ''} ${p.workorder ? p.workorder.id : ''}`);
      }
    }
  }
  const fillInAddress = (auto, addr, type='long_name') => {
    const getVal = (arr, nam) => arr.filter(i => i.types.includes(nam))[0][type];
    const place = auto.getPlace();
    console.log(place);
    let i = place.address_components;
    addr.line1.value = `${getVal(i, 'street_number')} ${getVal(i, 'route', 'short_name')}`;
    addr.locality.value = getVal(i, 'locality');
    addr.region.value = getVal(i, 'administrative_area_level_1', 'short_name');
    addr.postal_code.value = getVal(i, 'postal_code');
    addr.lat.value = place.geometry.location.lat();
    addr.lng.value = place.geometry.location.lng();
  }
  const agile = new Agile();
  agile.init();
  // FORMS INIT
  if (checkAddressForm) {
    const tabCallback = async (form, val) => {
      return new Promise((resolve) => {
        resolve('data from tab');
      });
    }
    const formCallback = (form, val) => {
      // let limiter = new Limiter(form.next, form.status);
      // limiter.init();
      // if (limiter.disabled) return false; // FORM HAS BEEN DISABLED
      return new Promise( async (resolve) => {
        let status = await agile.widthinZone(val);
        if (status.error) {
          form.status.innerHTML = msgError(status.detail);
        } else {
          if (status.result.length > 0) {
            form.status.innerHTML = msgSuccess(status.result[0].properties.Status);
          } else {
            form.status.innerHTML = msgError(`
              We could not find your address or you are located outside of our active service area.
            `);
          }
        }
        resolve('data from form');
      });
    }
    const checkAddress = new Form(checkAddressForm, formCallback);
    checkAddress.init();
  }
  if (checkWoForm) {
    const formCallback = (form, val) => {
      let container = document.querySelector('.check-wo-container');
      return new Promise( async (resolve) => {
        let list = await agile.checkList(val);
        if (list.error || list.detail) {
          form.status.innerHTML = msgError(list.detail);
        } else {
          form.status.innerHTML = msgSuccess('Work Order Found');
          let html = '';
          for (let i of list.result.items) {
            let content = '';
            if (typeof i.value === 'boolean') {
              content = i.value ? `&#9989; &nbsp; Complete` : `&#10060; &nbsp; Incomplete`;
            } else {
              content = i.value;
            }
            html += `<div class="group">
              ${msgGeneric(i.name, 35)}${i.value ? msgSuccess(content, 65) : msgError(content, 65)}
            </div>`;
          }
          container.innerHTML = html; 
        }
        resolve('data from form');
      });
    }
    const checkWo = new Form(checkWoForm, formCallback);
    checkWo.init();
  }
 
  //EVENT LISTENERS

  if (document.querySelectorAll('[data-packages]').length > 0) getPackages();
  
  if (document.querySelector('[name="line1"]')) {
    const addr = {
      line1: document.querySelector('[name="line1"]'),
      line2: document.querySelector('[name="line2"]'),
      locality: document.querySelector('[name="locality"]'),
      region: document.querySelector('[name="region"]'),
      postal_code: document.querySelector('[name="postal_code"]'),
      lat: document.querySelector('[name="lat"]'),
      lng: document.querySelector('[name="lng"]')
    }

    let autocomplete = new google.maps.places.Autocomplete(addr.line1, {
      componentRestrictions: { country: ["us", "id"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });
    addr.line1.focus();
    autocomplete.addListener("place_changed", () => fillInAddress(autocomplete, addr));
  }
});
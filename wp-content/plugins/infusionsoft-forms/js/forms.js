/* 
  Description: This file contains helper functions and constant variables 
  Author: Marcos Centeno
  Version: 1.0
*/

document.addEventListener("DOMContentLoaded", async () => {
  // VARIABLES
  const exists = [''.trim(), undefined, null, false, 'null'];

  const valid_phone = (x) => x.replace(/[^0-9]/g, '');
  const agile = 'https://agileisp.com/'
  const agileUrl = `${agile}api/`;
  const curPg = window.location.pathname;

  const addressNotFound = `<div class="warning">
    <strong>We could not find your address or you are located outside of our active service area.</strong><br>
    <!-- Please use a different method to locate your location. -->
  </div>`;
  var utmString = '';
  const agileLogin = document.querySelector('.loginbg');
  localStorage.setItem("agileAdmin", agileLogin ? true : false);
  const agileSubmit = document.querySelector('.loginbtn');
  const loginStatus = document.querySelector('.loginform .loginstatus');
  const salesRep = document.querySelector('[name=sales_rep]');
  const next = document.querySelector('[name=next]');
  const prev = document.querySelector('[name=prev]');	
  const shop = document.querySelector('.shopping-cart');
  const accessShop = document.querySelector('.access-shopping-cart');
  const verifyAddressForm = document.querySelector('.verify-address'); 
  const genericIfsForms = document.querySelectorAll(".ifs-form");
  const url = new URLSearchParams(window.location.search);
  let email = document.querySelector('.lookup');
  let wbOb;
  let checkedAdrs = false;
  let recursiveCnt = 0;

  const values = {
    create_account: true,
    packages: []
  }
  const hasProp = (obj) => Object.entries(obj).length > 0;
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
  const form = (form,  onTabChange=false) => {
    return new Promise(function (resolve) {

      // VARIABLES
      const values = {};
      const status = form.querySelector(".status");
      var compiledValues = [];

      // CUSTOM FUNCTIONS
      const switchTab = async (o, event, force=false) => {
        o.current.step.classList.remove('completed', 'cannot-skip', 'skipped', 'incomplete');
        let nextStage = parseInt(event.target.getAttribute('data-step'));
        let thisTab = validate(o.current.tab);
        let notValid = thisTab.filter(i => i.valid === false);
        let emptyFields = thisTab.filter(i => i.value === '' && i.field.type !== 'hidden');
        let hiddenFields = thisTab.filter(i => i.field.type === 'hidden');
        let validTab = (notValid.length > 0) ? false : true;
        let tabEmpty = (emptyFields.length === thisTab.length - hiddenFields.length) ? true : false;
        let moveStep = false;
        let processData = false;
        let finalStep = nextStage >= o.stage.length;
        if (validTab) {
          // DATA IS VALID, PROCCED
          if (tabEmpty) {
            o.current.statusElm.innerHTML = 'Skipped';
            o.current.step.classList.add('skipped');
            o.current.status = 'skipped';
          } else {
            o.current.statusElm.innerHTML = 'Completed';
            o.current.step.classList.add('completed');
            o.current.status = 'completed';
          }
          processData = true
          moveStep = true;
        } else {
          // INVALID DATA
          if (o.current.tabProps.allowskip) {
              // TAB CAN BE SKIPPED BUT USER NEEDS COMPLETE BEFORE SUBMITTING THE FORM
              o.current.statusElm.innerHTML = 'Needs Attention';
              o.current.step.classList.add('incomplete');
              o.current.status = 'incomplete';
              moveStep = true;
          } else {
            o.current.statusElm.innerHTML = 'Cannot Skip';
            o.current.step.classList.add('cannot-skip');
            o.current.status = 'cannot-skip';
          }
        }
        if (processData) {
          for (let value of thisTab) compiledValues.push(value);
          if (onTabChange) {
            let tabChangeStatus = await onTabChange(thisTab, event.target, o.current.index, status);
            if (!tabChangeStatus) return false;
          }
          if (finalStep) {
            let completedSteps = o.stage.filter(i => i.status === 'completed');
            let skippedSteps = o.stage.filter(i => i.status === 'skipped');

            if (!curPg.includes('access')) {
              if (completedSteps.length < o.stage.length && !force) {
                let header = '<h2 class="heading flex-center">Attention</h2>';
                let cursStatus = ''
                let l = o.stage;
                for (let i = 0; i < l.length; i++) {
                  btnLoader(o.next, true);
                  cursStatus += `<p>
                    <button data-step="${i}" class="btn dynamic-btn ${l[i].status} flex-row" style="color:#fff;max-width:280px;">
                      <span>${i + 1}.${l[i].name.toUpperCase()}</span>
                    </button>
                    <small>${l[i].status.toUpperCase()}</small>
                  </p>`;
                }
                let content = `
                  ${header}
                  <div class="body">
                  <h2>${skippedSteps.length} section${skippedSteps.length > 1 ? 's were' : ' was '} skipped. 
                  Click on ${skippedSteps.length > 1 ? 'them' : 'it'} to complete or submit the form now.</h2>
                    ${cursStatus}
                  </div>
                  <div class="footer" style="padding:1rem;flex-center;">
                    <button data-step="${l.length}" style="width:100%;max-width:280px;" class="btn dynamic-btn red">Submit</button>
                  </div>
                `;
                prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content });
                let dynamicBtn = document.querySelectorAll('.dynamic-btn');
                dynamicBtn.forEach((elem, index) => {
                  elem.addEventListener('click', async (event) => {
                    event.preventDefault();
                    prompt({ remove: true });
                    btnLoader(document.querySelector('[name="next"]'), false);
                    await switchTab(o, event, force=true);
                  });
                });
                return false;
              }
            }

            resolve(compiledValues);
            return false;
          }
        }
        if (moveStep) {
          if (finalStep) return false;
          o.current = o.stage[nextStage];
          o.next.setAttribute("data-step", o.current.index + 1);
          o.skip.setAttribute("data-step", o.current.index + 1);
          o.prev.setAttribute("data-step", o.current.index - 1);
          showtab(o);
        } 
        return false;
      }

      const fixStepIndicator = (e) => {
        for (let i of e.stage) i.step.classList.remove('active');
        if (e.current.index < e.stage.length) {
          e.current.step.classList.add('active');
        }
      }

      const showsteps = (e) => {
        e.next.setAttribute("data-step", e.current.index + 1);
        if (e.prev) e.prev.setAttribute("data-step", e.current.index - 1);
        if (e.steps.childNodes.length === 0) {
          let width = `style="flex: 0 1 ${100 / e.stage.length}%;"`;
          e.stage.forEach((i, index) => {
            e.steps.insertAdjacentHTML("beforeend", `
              <div ${width} class="step step-${index} flex-col" data-step="${index}">
                <small class="status"></small>
                <span>${index + 1}${ i.name ? `.${i.name.toUpperCase()}` : ''}</span>
              </div>
            `);
          });
        }

        e.steps.querySelectorAll('.step').forEach((i, index) => {
          e.stage[index].status = 'unused';
          e.stage[index].step = i;
          e.stage[index].statusElm = i.querySelector('.status');
          i.addEventListener('click', async (event) => {
            event.preventDefault();
            await switchTab(e, event);
          });
        });
        if (e.stage.length > 1) {
          if (!document.querySelector('.btn.skip')) {
            e.next.insertAdjacentHTML("beforebegin", `
              <button 
                class="btn skip" data-step="${e.current.index + 1}" 
                style="background:#fff;border:1px solid rgb(1,163,176);color:rgb(1,163,176) !important;margin-left:1rem;margin-right:1rem;"
                >Skip</button>
            `);
          }
          
          e.skip = document.querySelector('.btn.skip');
          e.skip.addEventListener('click', async (event) => {
            event.preventDefault();
            await switchTab(e, event);
          });
        }
        e.current = e.stage[e.current.index];
      }

      const showtab = (e) => { 
        if (e.skip) {
          if (e.current.tabProps.allowskip) {
            e.skip.style.display = e.current.index + 1 < e.stage.length ? 'flex' : 'none';
          } else {
            e.skip.style.display = 'none';
          }
        }
        
        for (let i of e.stage) i.tab.style.display = 'none';
        e.stage[e.current.index].tab.style.display = "flex";
        if (e.prev) e.prev.disabled = (e.current.index === 0) ? true : false;
        if (e.stage.length > 1) {
          e.next.innerHTML = (e.current.index == (e.stage.length - 1)) ? 'Submit' : e.next_content;
        }
        if (e.steps) fixStepIndicator(e);
      }

      multistep(); //INITIALIZE MULTI-STEP FUNCTION

      function multistep() {

        const multiStepList = form.querySelectorAll(".tabs");

        for (let singleMultiStep of multiStepList) {
          let tabList = singleMultiStep.querySelectorAll(".tab");
          const controller = {
            steps: singleMultiStep.querySelector('.steps'),
            next: singleMultiStep.querySelector('.controller button[name="next"]'),
            prev: singleMultiStep.querySelector('.controller button[name="prev"]'),
            skip: null,
            stage: []
          }
          let o = controller;
          for (let i = 0; i < tabList.length; i++) {
            let stringProps = tabList[i].getAttribute("data-props");
            if (stringProps) {
              let props = JSON.parse(stringProps);
              tabList[i].id = `id-${props.name.toLowerCase().replace(' ', '-')}`;
              o.stage.push({
                index: i,
                name: props.name,
                tab: tabList[i],
                tabProps: props
              });
            }
          }
          o.next_content = o.next.innerHTML;
          o.current = o.stage[0];
          if (o.steps) showsteps(o);

          showtab(o);
          const increase = async event => {
            event.preventDefault();
            await switchTab(o, event);
          }

          const decrease = async event => {
            event.preventDefault();
            await switchTab(o, event);
          }

          o.next.addEventListener('click', increase);
          if (!exists.includes(o.prev)) o.prev.addEventListener('click', decrease);
        }
      }
      
      function validate(current) { 
        let values = current.querySelectorAll("input, textarea, select"); 
        let msg = '';
        let data = [];
        let dup = [];
        values.forEach(field => {
          field.value = field.value.trim();
          if (field.type === 'radio') {
            if (!dup.includes(field.name)) {
              let options = [...values].filter(i => i.name === field.name);
              let checked = options.filter(i => i.checked);
              if (checked.length > 0) field = checked[0];
              data.push({
                'name': field.name, 
                'valid': field.validity.valid, 
                'field': field,
                'value': (checked.length > 0) ? field.value : ''
              });
              dup.push(field.name);
            }
            return;
          }
          if (field.type === 'checkbox') { 
            if (!dup.includes(field.name)) {
              data.push({
                'name': field.name, 
                'valid': field.validity.valid, 
                'field': field,
                'value': field.checked ? 'true' : ''
              });
              dup.push(field.name);
            }
            return;
          }
          if (field.type === 'text') {
            field.value = field.value.replace(/\s+/g,' ').trim();
          }
          if (field.type === 'tel') {
            field.value = valid_phone(field.value);
          }
          if (field.type === 'select-one') {
            field.placeholder = field.getAttribute('data-placeholder');
          }
          if (!dup.includes(field.name)) {
            data.push({
              'name': field.name, 
              'valid': field.validity.valid, 
              'field': field,
              'value': field.value // EXPERIMETAL
            });
          }
          dup.push(field.name);
        });
        Object.values(data).forEach(i => {
          if (!i.valid) {
            i.field.style.border = '1px solid #f5c6cb';
            i.field.style.background = '#f8d7da';
            msg += `<div class="warning">${i.field.placeholder}: ${i.field.validationMessage}</div>`;
          } else {
            i.field.style.border = '1px solid #c3e6cb';
            i.field.style.background = 'rgb(103,200,208)';
          }
        });
        status.innerHTML = msg;
        return Array.from(data).filter(i => i.field.classList.contains('form-input')); // THIS MIGHT RETURN TRUE INSTEAD
      }
    });
  }
  const urlParams = () => {
    let all = document.querySelectorAll(".ifs-form");
    let fields = {
      utm_adgroup: [`input[name="utm_adgroup"]`, `input[name="inf_custom_utm_adgroup"]`],
      utm_campaign: [`input[name="utm_campaign"]`, `input[name="inf_custom_utm_campaign"]`],
      utm_source: [`input[name="utm_source"]`],
      utm_medium: [`input[name="utm_medium"]`],
      utm_term: [`input[name="utm_term"]`],
      utm_content: [`input[name="utm_content"]`],
      email: [`input[name="email"]`, `input[name="inf_field_Email"]`],
      given_name: [`input[name="given_name"]`],
      family_name: [`input[name="family_name"]`],
      phone: [`input[name="phone"]`],
      address: [`input[name="line1"]`],
      address2: [`input[name="line2"]`],
      city: [`input[name="locality"]`],
      state: [`input[name="region"]`],
      postalcode: [`input[name="postal_code"]`],
      product_line: [`input[name="product_line"]`],
      contact_id: [`input[name="contact_id"]`],
      account_id: [`input[name="account_id"]`],
      lat: [`input[name="lat"]`, `input[name="latitude"]`],
      lng: [`input[name="lng"]`, `input[name="longitude"]`],
      workbook_id: [`input[name="workbook_id"]`],
      ifs_lead_id: [`input[name="ifs_lead_id"]`],
      product_line: [`input[name="product_line"]`]
    }
    const utm = ['utm_adgroup', 'utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content'];
    
    Object.keys(fields).forEach(i => {
      for (let e of fields[i]) {
        let elem = document.querySelectorAll(`${e}`);
        let param = url.get(i);
        if (param != null && elem.length > 0) {
          for (let x of elem) {
            if (utm.includes(i)) utmString += `&${i}=${param}`;
            x.value = formatData(param);
          }
        }
      }
    });
  }
  const add_accordion = (i) => {
    let head = i.querySelector('[data-accordion="head"]');
    let body = i.querySelector('[data-accordion="body"]');
    let arrow = i.querySelector('.arr');
    head.addEventListener('click', (e) => {
      e.preventDefault();
      arrow.classList.contains('active') ? arrow.classList.remove('active') : arrow.classList.add('active');
      head.classList.contains('active') ? head.classList.remove('active') : head.classList.add('active');
      body.classList.contains('active') ? body.classList.remove('active') : body.classList.add('active');
    });
  }
  const prompt = (a) => {
    let background = document.querySelector('#background');
    const close = () => {
      background.classList.add('hidden');
      background.innerHTML = '';
    }
    if (a.container) {
      if (a.container === 'popup') {
        var popup = `
          <div id="popup">
            <div class="close">X</div>
            <div class="content">${a.content}</div>
          </div>
        `;
        a.content = popup;
      }
    }
    background.style.background = a.background;
    background.innerHTML = a.content;
    background.classList.remove('hidden');

    if (a.remove) close();
    if (popup) {
      background.querySelector('#popup > .close').addEventListener('click', close);
    }
  }
  const formatData = (string) => {
    const chkAgainst = ['+']
    let newArr = '';
    if (string) {
      let arr = string.split('');
      for (let i = 0; i < arr.length; i++) {
        if (chkAgainst.includes(arr[i])) arr[i] = ' ';
      }
      newArr = arr.join("");
    }
    return newArr;
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
    var tmp;
    
    return fetch(api.url, api).then(res => {
      tmp = res.status;
      if (api.report || ![200, 201, 202, 203].includes(tmp)) console.log(res);
      return api.res ? res.text() : res.json();
    }).then(data => {
      if (api.report || ![200, 201, 202, 203].includes(tmp)) console.log(data, api);
      data.status = tmp;
      return data;
    }).catch(err => {
      console.log(api);
      console.log(err);
    });
  }

  // AGILE SCRIPTS

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
      localStorage.setItem("agileRepToken", res.token);
      localStorage.setItem("agileRepEmail", res.email);
      localStorage.setItem("agileRepId", res.id);
      return res.token;
    });
  }
  const getToken = async () => {
    if (localStorage.getItem("agileAdmin") === 'true') {
      if (localStorage.getItem("agileRepEmail") === 'cmason@anthembusinessgroup.com') {
        localStorage.setItem("agileRepToken", null);
        localStorage.setItem("agileRepEmail", null);
        localStorage.setItem("agileRepId", null);
      }
      if (exists.includes(localStorage.getItem("agileRepToken"))) {
        agileLogin.style.display = 'flex';
      } else {
        let verified = await verifyToken(localStorage.getItem("agileRepToken"));
        if (verified) {
          salesRep.value = localStorage.getItem("agileRepEmail");
          agileLogin.style.display = 'none';
          return localStorage.getItem("agileRepToken");
        } else {
          agileLogin.style.display = 'flex';
          return false;
        }
      }
    } else {
      // If token is null request brand new token 
      if (exists.includes(localStorage.getItem("agileRepToken"))) {
        return updateToken('');
      }
      // check if agile token is valid. 
      // Attempt to refresh token if no longer valid
      if (await verifyToken(localStorage.getItem("agileRepToken"))) {
        return localStorage.getItem("agileRepToken");
      } else {
        // Try to refresh Agile token
        let newToken = await refreshToken(localStorage.getItem("agileRepToken"));
        // If refreshtoken is sucessfull, send new token to server
        // If refreshtoken is not sucessfull, request server for a brand new token
        return newToken.token ? newToken.token : updateToken(''); 
      }
    }
  }
  const newRepToken = async (e) => {
    e.preventDefault();
    btnLoader(e.target, true);
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
      btnLoader(e.target, false);
      if (![200].includes(res.status)) {
        console.log(res);
        loginStatus.innerHTML = `<div class="warning">${res.non_field_errors[0]}</div>`;
      }
      localStorage.setItem("agileRepToken", res.token);
      localStorage.setItem("agileRepEmail", res.email);
      localStorage.setItem("agileRepId", res.id);
      salesRep.value = res.email;
      agileLogin.style.display = 'none';
      loadPackages();
    });
  }
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
    if (a.ifs_lead_id) body.ifs_lead_id = a.ifs_lead_id;
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
    if (data.opportunity_stage !== '' && data.opportunity_stage) {
      ob.opportunity_stage = data.opportunity_stage;
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
  const makeSale = async (workbook_id, elem) => {
    let token = await getToken();
    let api = {
      url: `${agileUrl}sales/make_sale/`,
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`}),
      body: JSON.stringify({workbook_id: workbook_id})
    }
    return await ajax(api).then( async res => {
      if (res.status === 500 && recursiveCnt < 4) {
        recursiveCnt = recursiveCnt + 1;
        console.log(`Error ${res.status} - Trying again in 30 seconds, try #${recursiveCnt}`);
        var timeout = setTimeout( async () => await makeSale(workbook_id, elem), 30000);
      } else {
        clearTimeout(timeout);
        showStatus(res, elem, 'Finish Sale');
        return [200, 201, 202].includes(res.status) ? res : false;
      }
    });
  }
  const widthinZone = async (i) => {
    let token = await getToken();
    let string = `${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}`;
    let api = {
      url: `${agileUrl}fiber-tool/zone_status/?address=${string}&project_id=v%3A${i.project_id}&o=${i.o}`,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}` }
    }
    if (i.lat) api.url = `${api.url}&latitude=${i.lat}`;
    if (i.lng) api.url = `${api.url}&longitude=${i.lng}`;
    return await ajax(api);
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
      // USE THIS LOG TO OUTPUT CUSTOM FIELDS
      // console.log(res);
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
    if (thisTab.check_address) {
      let status = await widthinZone(thisTab);
      if (!status.result.length > 0) {
        let stat = document.querySelector('.controller .status');
        stat.innerHTML = addressNotFound;
        btnLoader(elem, false);
        return false;
      }
    }

    if (thisTab.create_contact) {
      if (!url.get('address') && !checkedAdrs) {
        let wo = await woLookup(thisTab.line1, thisTab.o);
        if (wo.length > 0) {
          woExistsPrompt(wo);
          btnLoader(elem, false);
          checkedAdrs = true;
          return false;
        }
      }

      wbOb = generateWoObj(thisTab);
      let wb = await workbook(wbOb, elem, 'Workbook Entry');
      wbOb.workbook_id = parseInt(wb.result.workbook_id);
      thisTab.workbook_id = parseInt(wb.result.workbook_id);
      let ifs = infusionsoftSubmit(thisTab);
      let workbook_id_list = document.querySelectorAll('[name=workbook_id]');
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
      let price = data.filter(i => i.name === 'package')[0];
      values.packages.push({ id: parseInt(thisTab.package), qty: 1 });
      wbOb.packages.push({ id: parseInt(thisTab.package), qty: 1 });
      values.due_on_install = parseInt(price.field.getAttribute('data-price'));
      wbOb.due_on_install = parseInt(price.field.getAttribute('data-price'));
      let wbPack = await workbook(wbOb, elem, 'Package');
      delete thisTab.package;
    }

    if (thisTab.contracts) {
      if (wbOb.packages.length > 0) {
        if (wbOb.packages[0].id !== 102) {
          thisTab.tags += `,${thisTab.dynamic_tags}`;
        }
      }

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
      thisTab.notes = notes;
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
  const onTabChangeAccess = async (data, elem, curTab, stat) => {
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
      let agileCon = await agileCreateContact(thisTab, elem, 'Agile ');
      let conId = document.querySelectorAll('[name=contact_id]');
      let accId= document.querySelectorAll('[name=account_id]');
      for (let i of conId) i.value = agileCon.contact.id;
      for (let i of accId) i.value = agileCon.account.id;
      thisTab.contact_id = agileCon.contact.id;
      thisTab.account_id = agileCon.account.id; 

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

    if (thisTab.package && thisTab.package !== '') {
      values.packages.push({ id: parseInt(thisTab.package), qty: 1 });
      thisTab.packages = [{ id: parseInt(thisTab.package), qty: 1 }];
      let p = await workorderToWb(thisTab, next);
      console.log(p);
      delete thisTab.package;
    }

    if (thisTab.create_wo) {
      let contractData = infusionsoftSubmit(thisTab);
      let i = thisTab;
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
      `;
      thisTab.notes = notes;

      let woCreate = await createWo(thisTab, elem, 'Workorder');
      let woId = document.querySelectorAll('[name=workorder_id]');
      for (let i of woId) i.value = woCreate.workorder.id;
      thisTab.workorder_id = woCreate.workorder.id;
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
    console.log(values);
    return true;
  }
  const onTabChangeGeneric = (data) => {
    let values = {}
    data.forEach(i => values[i.field.name] = i.field.value);
    let api = {
      body: `action=fi_submit_contact&data=${JSON.stringify(values)}`,
      url: fi_submit_contact.ajax_url,
      method: 'POST',
      report: true
    }
    ajax(api).then(res => {
      let email = {}
      for (let i of document.querySelectorAll('[name="email"]')) email[i.type] = i;
      email.hidden.value = email.email.value;
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
  const selectUpdate = (e) => {
    const string = e.name.replace('_update', '');
    let element = document.querySelector(`[name=${string}]`);
    element.value = e.options[e.selectedIndex].value;
  }
  const getCheckList = async (workorder_id) => {
    let token = await getToken();
    if (token) {
      let api = {
        url: `${agileUrl}workorder/get_fiber_checklist/?workorder_id=${workorder_id}`,
        method: 'GET',
        headers: new Headers({'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${token}`})
      }
      return await ajax(api).then(res => {
        if ([200, 201, 202, 203].includes(res.status)) {
          return res.result;
        } else {
          console.log(`Agile: ${res.detail}`);
        }
      });
    }
  }
  const updateOrg = (e) => {
    let list = document.querySelectorAll('[name=project_id]');
    let id = e.options[e.selectedIndex].getAttribute('data-project-id');
    for (let i of list) i.value = id;
    updateProductLine(e);
  }
  const updateProductLine = (e) => {
    selectUpdate(e);
    let line = document.querySelector('[name=product_line]');
    let o = document.querySelector('[name=o]');
    if (line) {
      if (line.value !== '' && o.value !== '') {
        let type = o.value == 1 ? 'carey' : 'elko';
        let product_line = line.value == 83 ? 'residential' : 'commercial';
        getPackages(product_line, type);
      } 
    }
  }
  const fillInAddress = (auto) => {
    
    const place = auto.getPlace();
    console.log(place.address_components);
  }

  // FORMS INIT

  const initVerifyAddress = async (firstTry=true) => {

    const formStatus = verifyAddressForm.querySelector('.controller .status');
    // var manual = verifyAddressForm.querySelector('#manual');
    const sendData = url =>  window.location.href = url;

    let formEx = false;
    if (storageAvailable('localStorage')) {
      formEx = localStorage.getItem("formex");
      if (formEx) formEx = JSON.parse(formEx);
    }

    if (formEx) {
      if (formEx.disabled) {
        let exp = new Date(formEx.exp);
        let now = new Date();
        if (now > exp) {
          formEx = '';
          localStorage.removeItem('formex');
        } else {
          let remining = Math.floor((((exp - now) / 1000) / 60));
          verForm.querySelector('#btn').disabled = true;
          verForm.querySelector('.status').innerHTML = `
            <p style="color:red;">Limit of uses reached<br>Try again in ${remining} minutes</p>
          `;
        }
      }
    }
    let token = await getToken();
    if (firstTry == false) {
      // manual.classList.remove('hidden');
      formStatus.innerHTML = addressNotFound;
    }
    form(verifyAddressForm).then( async val => {
      let next = document.querySelector('[name="next"]');
      btnLoader(next, true);
      let newVal = {};
      for (let i in val) newVal[val[i].name] = val[i].field.value;     
      let status = await widthinZone(newVal);
      if (status.result.length > 0) {
        if (formEx) {
          formEx.cnt = parseInt(formEx.cnt) + 1;
        } else {
          formEx = {
            cnt: 1,
            disabled: false
          }
        }
        
        // if (formEx.cnt > 2) {
        //   if (!formEx.disabled) {
        //     let dt = new Date();
        //     dt.setHours( dt.getHours() + 1 );
        //     formEx.disabled = true;
        //     formEx.exp = dt;
        //   }
        // }
        let i = newVal;
        i.address = `${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}`;
        let addrObj = `address=${i.line1}&address2=${i.line2}&city=${i.locality}&state=${i.region}&postalcode=${i.postal_code}`
        let j = `${verifyAddressForm.action}?`;
        let o = status.result[0].properties.Status;
        if (formEx) localStorage.setItem("formex", JSON.stringify(formEx));
        sendData(`${j}${addrObj}&status=${o}${utmString}&o=${i.o}`);
        setTimeout(() => btnLoader(next, false), 8000);
      } else {
        initVerifyAddress(firstTry=false);
        btnLoader(next, false);
      }
    });
  }
  const initShopCartForm = async (firstTry=true) => {
    form(shop, onTabChange).then( async val => {
      btnLoader(next, true);
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

      let p = await makeSale(i.workbook_id, next);
      let records = ``;
      if (localStorage.getItem("agileAdmin") === 'true') {
        let e = `https://agileisp.com/?`;
        let u = `https://vx952.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=`
        records = `
          Workorder Number: <a href="${e}s=wo&p=edit&pk=${p.result.workorder_id}&o=5" target="_blank"> 
            #${p.result.workorder_id}
          </a><br>
          Workbook Number: <a href="${e}o=5&s=sales&p=workbook&id=${p.result.workbook_id}" target="_blank"> 
            #${p.result.workbook_id}
          </a><br>
          Keap id: <a href="${u}${i.ifs_lead_id}" target="_blank"> #${i.ifs_lead_id}</a><br>
        `;
      } else {
        records = `
          Workorder Number: #${p.result.workorder_id}<br>
          Workbook Number: #${p.result.workbook_id}<br>
        `;
      }

      shop.innerHTML = `<div>
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
      </div>`;
      btnLoader(next, false);
    });
  }
  const initAccessShop = async (firstTry=true) => {
    form(accessShop, onTabChangeAccess).then( async val => {
      btnLoader(next, true);
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

      let p = await makeSale(i.workbook_id, next);

      shop.innerHTML = `<div>
        <h4>Data submitted successfully</h4>
        Name: ${i.given_name} ${i.family_name}<br>
        Phone: ${i.phone}<br>
        Email: ${i.email}<br>
        ${i.notification_email ? `Notification Email: ${i.notification_email}<br>` : ''}
        Workorder Number: #${p.result.workorder_id}<br>
        Workbook Number: #${p.result.workbook_id}<br>
        Service Address: ${i.line1}, ${i.locality}, ${i.region} ${i.postal_code}<br>
        Nid Location: ${i.nid_location}<br>
        Agreed to Terms & Conditions: ${i.terms_conditions === 'true' ? 'yes' : 'no'}<br>
        Agreed to Give Property Access: ${i.property_access === 'true' ? 'yes' : 'no'}<br>
        Property Owner: ${i.own_location === 'true' ? 'yes' : 'no'}<br>
        Agreed that this is a legal Signature: ${i.legal_signature === 'true' ? 'yes' : 'no'}<br>
        Customer requires to be at home during installation: ${i.installation_notification === 'true' ? 'yes' : 'no'}<br>
        ${or !== '' ? `Products:<br>${or}`: ''}
      </div>`;
      btnLoader(next, false);
    });
  }
  const initGenericForm = async (firstTry=true) => {
    for (let i of genericIfsForms) {
      form(i, onTabChangeGeneric).then( data => {
        let values = {}
        data.forEach(i => values[i.field.name] = i.field.value);
        let api = {
          body: `action=fi_submit_contact&data=${JSON.stringify(values)}`,
          url: fi_submit_contact.ajax_url,
          method: 'POST',
          report: true
        }
        ajax(api).then(res => window.location.replace(i.action));
      });
    }
  }
  const checkList = () => {
    form(document.querySelector('.checklist')).then( async val => {
      let next = document.querySelector('[name="next"]');
      let container = document.querySelector('.checklist-container');
      btnLoader(next, true);
      let newVal = {};
      for (let i in val) newVal[val[i].name] = val[i].field.value;
      let list = await getCheckList(newVal.workorder_id);
      let html = '';
      if (list) {
        let yes = `<svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          class="bi bi-check-square-fill" 
          viewBox="0 0 16 16">
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
        </svg> `;
        let no = `<svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          class="bi bi-x-square-fill" 
          viewBox="0 0 16 16">
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
        </svg>`;
        for (let i of list.items) {
          let content = '';
          let styles = '';
          if (typeof i.value === 'boolean') {
            content = i.value ? `${yes} &nbsp; Complete` : `${no} &nbsp; Incomplete`;
            styles = i.value ? 'background:#d1e7dd;color:#0f5132;' : 'background:#f8d7da;color:#842029;';
          } else {
            content = i.value;
          }
          html += `<div class="input-group mb-1">
            <span class="input-group-text col-5">${i.name}</span>
            <span class="input-group-text col-7" style="${styles}">${content}</span>
          </div>`;
        }
      } else {
        html = `<div class="alert alert-danger" role="alert">Work Order not Found.</div>`;
      }
      
      container.innerHTML = html; 
      btnLoader(next, false);
      checkList();
    });
  }
  
  // INITIALIZE
  urlParams();
  loadPackages();

  if (genericIfsForms.length > 0) await initGenericForm();
  if (verifyAddressForm) await initVerifyAddress();
  if (shop) await initShopCartForm();
  if (document.querySelector('.checklist')) await checkList();
  if (accessShop) await initAccessShop();
  if (salesRep) salesRep.value = localStorage.getItem("agileRepEmail");

  const oUpdate = document.querySelector('[name=o_update]');
  if (oUpdate) {
    updateOrg(oUpdate);
    oUpdate.addEventListener('change', elem => updateOrg(elem.target));
  }

  const productLineUpdate = document.querySelector('[name=product_line_update]');
  if (productLineUpdate) {
    updateProductLine(productLineUpdate);
    productLineUpdate.addEventListener('change', (elem) => updateProductLine(elem.target));
  }

  if (url.get('address')) {
    let address = formatData(url.get('address'));
    let city = formatData(url.get('city'));
    let state = formatData(url.get('state'));
    let postalcode = formatData(url.get('postalcode'));
    let addrContainer = document.querySelector('#vac');
    if (addrContainer) {
      addrContainer.innerHTML = `${address}, ${city}, ${state} ${postalcode}`;
    }
    if (address !== '' && city !== '') {
      let wo = await woLookup(address, url.get('o'));
      if (wo.length > 0) {
        woExistsPrompt(wo);
      }
    }
  }

  const zone_status = document.querySelector('.zone_status');
  if (zone_status) {
    if (url.get('status')) {
      let cap = url.get('status').charAt(0).toUpperCase() + url.get('status').slice(1);
      zone_status.innerHTML = cap;
      zone_status.removeAttribute('hidden');
    }
  }
 
  //EVENT LISTENERS
  const sendContract = document.querySelector('#send_contract');
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

  const addon = document.querySelectorAll('.addon');
  let addon_tags = document.querySelector('.addontags');
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
  
  const select_update = document.querySelectorAll('.select_update');
  if (select_update.length > 0) {
    for (let i of select_update) {
      selectUpdate(i);
      i.addEventListener('change', elem => selectUpdate(elem.target));
    }
  }

  const packageList = document.querySelectorAll('[data-packages]');
  if (packageList.length > 0) {
    getPackages();
  }

  const owner = document.querySelectorAll('[name="own_location"]');
  if (owner) {
    let no = document.querySelector('#owner_no');
    let yes = document.querySelector('#owner_yes');
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
    let ifs_id = document.querySelectorAll('[name=ifs_lead_id]');
    for (let i of ifs_id) i.value = ifs.contact.id;
  }

  if (email) {
    email.addEventListener('change', async () => {
      if (!email.validity.valid) {
        email.insertAdjacentHTML("afterend", `<small class="lookupstatus warning">${email.validationMessage}</small>`);
        return false;
      }
      let utm_source = document.querySelector('[name=utm_source]');
      let utm_adgroup = document.querySelector('[name=utm_adgroup]');
      let utm_campaign = document.querySelector('[name=utm_campaign]');
      let utm_medium = document.querySelector('[name=utm_medium]');
      let utm_term = document.querySelector('[name=utm_term]');
      let utm_content = document.querySelector('[name=utm_content]');
      let source_page = document.querySelector('[name=source_page]');
      let sales_rep = document.querySelector('[name=sales_rep]');
      let workbook_id = document.querySelector('[name=workbook_id]');

      let ifsData = {
        email: email.value,
        utm_source: utm_source ? utm_source.value : '',
        utm_adgroup: utm_adgroup ? utm_adgroup.value : '',
        utm_campaign: utm_campaign ? utm_campaign.value : '',
        utm_medium: utm_medium ? utm_medium.value : '',
        utm_term: utm_term ? utm_term.value : '',
        utm_content: utm_content ? utm_content.value : '',
        source_page: source_page ? source_page.value : '',
        sales_rep: sales_rep ? sales_rep.value : '',
        workbook_id: workbook_id ? workbook_id.value : ''
      }
      let ifs = await infusionsoftSubmit(ifsData);
      let ifs_id = document.querySelectorAll('[name=ifs_lead_id]');
      for (let i of ifs_id) i.value = ifs.contact.id;
    });
  }

  if (localStorage.getItem("agileAdmin") === 'true') {
    agileSubmit.addEventListener('click', newRepToken);
  }
  
  let address1Field = document.querySelector("#ship-address");

  let autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ["us", "id"] },
    fields: ["address_components", "geometry"],
    types: ["address"],
  });
  address1Field.focus();

  autocomplete.addListener("place_changed", () => fillInAddress(autocomplete));
});
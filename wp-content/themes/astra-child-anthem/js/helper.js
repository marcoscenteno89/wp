/* 
Description: This file contains helper functions and constant variables 
Author: Marcos Centeno
Version: 1.0
*/
const exists = [''.trim(), undefined, null, false, 'null'];
const valid_phone = (x) => x.replace(/[^0-9]/g, '');
const agileUrl = 'https://agileisp.com/api/';
const curPg = window.location.pathname;
let agileRepToken = localStorage.getItem("agileRepToken");
let agileRepEmail = localStorage.getItem("agileRepEmail");
let agileAdmin = localStorage.getItem("agileAdmin");

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
                await switchTab(o, event, force=true);
              });
            });
            return false;
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
      Object.keys(data).forEach(i => {
        if (data[i].field.type !== 'hidden') {
          if (!data[i].valid) {
            data[i].field.style.border = '1px solid #f5c6cb';
            data[i].field.style.background = '#f8d7da';
            msg += `<div class="warning">
              ${data[i].field.placeholder}: ${data[i].field.validationMessage}
            </div>`;
          } else {
            data[i].field.style.border = '1px solid #c3e6cb';
            data[i].field.style.background = 'rgb(103,200,208)';
          }
        }
      });
      status.innerHTML = msg;
      return Array.from(data).filter(i => i.field.classList.contains('form-input')); // THIS MIGHT RETURN TRUE INSTEAD
    }
  });
}

const prompt = (a) => {
  let background = document.querySelector('#background');
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
  if (popup) background.querySelector('#popup > .close').addEventListener('click', close);

  function close() {
    background.classList.add('hidden');
    background.innerHTML = '';
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
    if (api.report || (tmp !== 200 && tmp !== 203)) console.log(res);
    return api.res ? res.text() : res.json();
  }).then(data => {
    if (api.report || (tmp !== 200 && tmp !== 203)) console.log(data, api);
    data.status = tmp;
    return data;
  }).catch(err => {
    console.log(api);
    console.log(err);
  });
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
  if(agileAdmin === 'true') {
    if (agileRepEmail === 'cmason@anthembusinessgroup.com') {
      localStorage.setItem("agileRepToken", null);
      localStorage.setItem("agileRepEmail", null);
    }
    
    if (exists.includes(agileRepToken)) {
      agileLogin.style.display = 'flex';
    } else {
      if (await verifyToken(agileRepToken)) {
        salesRep.value = agileRepEmail;
        agileLogin.style.display = 'none';
        return agileRepToken;
      } else {
        agileLogin.style.display = 'flex';
      }
    }
    
  } else {
    // If token is null request brand new token 
    if (exists.includes(agileRepToken)) {
      return updateToken('');
    }
    // check if agile token is valid. 
    // Attempt to refresh token if no longer valid
    if (await verifyToken(agileRepToken)) {
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
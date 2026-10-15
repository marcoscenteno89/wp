const msgError = (msg, width) => {
  return `<div class="msg warning" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const msgSuccess = (msg, width) => {
  return `<div class="msg success" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const msgGeneric = (msg, width) => {
  return `<div class="msg generic" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const exists = [''.trim(), undefined, null, false, 'null'];

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
    this.loader = new Loader(this.next, 3);

    this.init();
  }
  init() {
    let tabListNode = this.form.querySelectorAll(".tab");
    this.next.setAttribute('data-text', this.next.innerHTML);
    tabListNode.forEach( (tab, i) => {
      let name = tab.getAttribute('data-name');
      tab.id = `id-${name.toLowerCase().replace(' ', '-')}`;
      this.tabList.push({
        valid: true,
        index: i,
        name: name,
        tab: tab,
        values: {}
      });
      let width = `style="flex: 0 1 ${100 / tabListNode.length}%;"`;
      let step = tabListNode.length > 1 ? `${(i + 1)}.` : '';
      this.form.querySelector('.steps').insertAdjacentHTML("beforeend", `
        <div ${width} class="step step-${i} flex-col" data-step="${i}">
          <span class="number">${step}</span>
          <span class="title">${name.toUpperCase()}</span>
        </div>
      `);
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
    this.loader.on()
    let nextStep = parseInt(event.target.getAttribute('data-step'));
    if (this.currentTab < nextStep) {
      this.validateData();
    }
    if (!this.tabList[this.currentTab].valid) {
      this.loader.off();
      return false;
    }
    if (nextStep >= this.tabList.length) {
      await this.formCompleteCallback(this, this.values);
      this.loader.off();
      return false;
    }
    if (this.tabChangeCallback) {
      await this.tabChangeCallback(this, this.tabList[this.currentTab].values);
    }
    
    this.previousTab = this.currentTab;
    this.currentTab = nextStep;
    this.clearPreviousTab();
    this.showNewTab();
    this.loader.off();
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

    this.init();
  }

  init() {
    if (storageAvailable()) {
      let jsonData = localStorage.getItem(`agile_${this.target.getAttribute('data-limit-id')}`);
      if (jsonData) { // USE EXISTING DATA 
        this.dataExists(JSON.parse(jsonData));
      } else { // NO DATA AVAILABLE, CREATE NEW ENTRY
        this.resetLimit();
      }
      if (this.now > this.expiration) {
        this.resetLimit();
      }
      if (this.disabled) {
          this.currentlyDisabled();
          return false;
      }
      if (this.count >= this.countLimit) {
        this.disableTarget();
        this.currentlyDisabled();
        return false;
      }
      this.save();
    }
  }

  add() {
    this.count = this.count + 1;
    let label = this.id.replace('_', ' ');
    console.log(`You can try ${label} ${this.countLimit - this.count} more times.`);
    this.setExpiration();
    this.save();
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

  setExpiration() {
    this.expiration = new Date();
    if (this.min > 0) this.expiration.setMinutes( this.now.getMinutes() + this.min );
    if (this.hr > 0) this.expiration.setHours( this.now.getHours() + this.hr);
    if (this.day > 0) this.expiration.setHours( this.now.getHours() + (this.day * 24));
  }
  disableTarget() {
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

class Loader {
  constructor(target, version) {
    this.target = target;
    this.content = target.innerHTML;
    this.loader = `<div class="loader loader-${version}"></div>`;
    this.disabled = false;
  }

  on() {
    this.target.innerHTML = this.loader;
    this.disabled = true;
  }

  off() {
    this.target.innerHTML = this.content;
    this.disabled = false;
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

const storageAvailable = () => {
  try {
    const testKey = 'test';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch(e) {
    console.log('localStorage not available');
    return false;
  }
}

export { 
  Form, Limiter, Loader, exists, ajax, msgError, msgSuccess, msgGeneric, storageAvailable 
}
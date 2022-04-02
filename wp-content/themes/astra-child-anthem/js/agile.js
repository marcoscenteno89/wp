const agileUrl = 'https://agileisp.com/api/';
// const agileUrl = 'https://testlb.agileisp.com/api/';
// const agileUrl = 'http://live.agileisp.com/api/';
// const agileUrl = 'http://localhost:8000/api/';
const curPg = window.location.pathname;
const agileLogin = document.querySelector('.loginbg');
const agileSubmit = document.querySelector('.loginbtn');
const loginStatus = document.querySelector('.loginform .loginstatus');
const salesRep = document.querySelector('[name=sales_rep]');
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
  if (curPg.includes('sales-entry') && curPg.includes('access')) {
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

document.addEventListener("DOMContentLoaded", async () => {
  //EVENT LISTENERS
  if (curPg.includes('sales-entry') && curPg.includes('access')) {
    agileSubmit.addEventListener('click', newRepToken);
  }
});
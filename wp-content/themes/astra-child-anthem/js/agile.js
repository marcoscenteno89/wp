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
  return ajax(api).then(res => res.token ? true : false);
}
const refreshToken = tok => {
  let api = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    url: `${agileUrl}auth-token/refresh/`,
    method: 'POST',
    body: JSON.stringify({token: tok})
  }
  return ajax(api).then(res => {
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
    localStorage.setItem("agileRepToken", res.token);
    localStorage.setItem("agileRepEmail", res.email);
    return res.token;
  });
}
const getToken = async () => {
  let agileRepToken = localStorage.getItem("agileRepToken");
  let agileRepEmail = localStorage.getItem("agileRepEmail");
  if (curPg.includes('sales-entry')) {
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
      salesRep.value = agileRepEmail;
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
      loginStatus.innerHTML = `<div class="warning">${res.non_field_errors[0]}</div>`;
    }
    localStorage.setItem("agileRepToken", res.token);
    localStorage.setItem("agileRepEmail", res.email);
    salesRep.value = res.email;
    agileLogin.style.display = 'none';
    await loadPackages();
  });
}

//EVENT LISTENERS
if (curPg.includes('sales-entry')) {
  agileSubmit.addEventListener('click', newRepToken);
}
const agileUrl = 'https://agileisp.com/api/';
// const agileUrl = 'https://testlb.agileisp.com/api/';
// const agileUrl = 'http://live.agileisp.com/api/';
// const agileUrl = 'http://localhost:8000/api/';
const values = {
  create_account: true,
	products: []
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
    localStorage.setItem("agiletoken", res.token);
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
    localStorage.setItem("agiletoken", res.token);
    return res.token;
  });
}
const getToken = async () => {
  let agileToken = localStorage.getItem("agiletoken");
  // If token is null request brand new token 
  if (exists.includes(agileToken)) return updateToken('');
  // check if agile token is valid. 
  // Attempt to refresh token if no longer valid
  if (await verifyToken(agileToken)) {
    return agileToken;
  } else {
    // Try to refresh Agile token
    let newToken = await refreshToken(agileToken);
    // If refreshtoken is sucessfull, send new token to server
    // If refreshtoken is not sucessfull, request server for a brand new token
    return newToken.token ? newToken.token : updateToken(''); 
  }
}
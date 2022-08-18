document.addEventListener("DOMContentLoaded", () => {

  // VARIABLES
  const exists = [''.trim(), undefined, null, false, 'null'];
  const valid_phone = (x) => x.replace(/[^0-9]/g, '');
  const agileUrl = 'https://agileisp.com/api/';
  // const curPg = window.location.pathname;
  // var manual = document.querySelector('.verify-address #manual');

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

  const inputmanual = () => {
    // const manualSub = document.querySelector('#manualsub');
    // manual.setAttribute("disabled", "disabled");
    // manualSub.setAttribute("disabled", "disabled");
    const map = new google.maps.Map(document.querySelector('#map'), {
      zoom: 11,
      center: { lat: 40.79, lng: -115.6 }
    });
    map.addListener('click', (e) => {
    if (!addressmarker) placeMarker(e.latLng, map);
    });
    var addressmarker;
    function placeMarker(position, map) {
      // manualSub.removeAttribute("disabled");
      addressmarker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true
      });
      map.panTo(position);
      google.maps.event.addListener(addressmarker, 'dragend', () => position = addressmarker.getPosition());
      // manualSub.addEventListener('click', async (e) => {
      //   prompt({remove: true});
      //   let token = await getToken();
      //   manual.removeAttribute("disabled");
      //   e.preventDefault();
      //   address.lat = position.lat();
      //   address.lng = position.lng();
      //   let i = address;
      //   let j = `${verForm.action}?`;
      //   let o = status.result[0].status;
      //   let status = await widthinZone({addr: address, token: token});
      //   if (status.result.length > 0) {
      //     let j = `${verForm.action}?`;
      //     sendData(`
      //       ${j}address=${i.address}&city=${i.city}&state=${i.state}&zip=${i.zip}&status=${o}&lat=${i.lat}&lng=${i.lng}
      //     `);
      //   } else {
      //     let markerStatus =  document.querySelector('#markerstatus');
      //     if (!markerStatus) {
      //       formStatus.innerHTML += `
      //       <p id="markerstatus" style="color:red;padding:7px;margin:7px 0;border:1px solid red;border-radius:5px;">
      //       It looks like you are outside of the current construction plan. Please <br>
      //       <a style="font-weight:bold;color:red!important;text-decoration:underline!important;" 
      //         href="https://anthembroadband.com/request-coverage/">click here</a> 
      //       to request future serve be brought to your location.<p>`;
      //     }
      //   }
      // });
    }
  }

  // const mapContainer = `
  //   <h2 class="heading flex-center" style="color:#fff;text-align:center;padding:1rem;">
  //     Zoom in, then click to place a pin on your home or business.
  //   </h2>
  //   <div id="map"></div>
  //   <button style="margin:1rem;color:#fff;" class="btn cta" id="manualsub">Submit</button>
  // `;

  const remChar = (text, char) => {
    let substr = text.substr(0, text.lastIndexOf(char));
    return text.replace(substr, ''.repeat(substr.length));
  }
  let navItems = document.querySelectorAll('.navbar-nav li');

  const isInView = (el) => {
    let currentelem = el;
    let top = el.offsetTop;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }

    return (
      top + 450 < (window.pageYOffset + window.innerHeight) &&
      (top + height - 450) > window.pageYOffset
    );
  }
  
  function initMap() {
    const navElements = []
    for (let i of navItems) {
      navElements.push({
        navElem: i,
        triggerElem: document.querySelector(`${remChar(i.childNodes[0].href, '#')}`)
      });
    }

    if (document.querySelector('#ast-mobile-popup-wrapper')) {
      document.querySelector('#ast-mobile-popup-wrapper').style.display = 'none';
    }
      
    // if (manual) {
    //   manual.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     document.querySelector('#background').style.display = 'flex';
    //     // prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: mapContainer });
    //     inputmanual();
    //   });
    // }
    // window.addEventListener('scroll', () => {
    //   for (let i of navElements) {
    //     if (isInView(i.triggerElem)) {
    //       i.navElem.classList.add('active');
    //     } else {
    //       i.navElem.classList.remove('active');
    //     }
    //   }
    // });
  }

  initMap();

});
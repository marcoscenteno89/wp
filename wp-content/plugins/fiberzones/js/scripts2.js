const mapContainer = `
	<h2 class="heading flex-center" style="color:#fff;text-align:center;padding:1rem;">
		Zoom in, then click to place a pin on your home or business.
	</h2>
	<div id="map"></div>
	<button style="margin:1rem;color:#fff;" class="btn cta" id="manualsub">Submit</button>
`;
const verForm = document.querySelector('.verify-address');
if (verForm) {
	var formStatus = verForm.querySelector('.status');
	var manual = verForm.querySelector('#manual');
	var address = {}
	var sendData = (url =>  window.location.href = url);
}
const remChar = (text, char) => {
  let substr = text.substr(0, text.lastIndexOf(char));
  return text.replace(substr, ''.repeat(substr.length));
}
let navItems = document.querySelectorAll('.navbar-nav li');
let formEx = false;
if (storageAvailable('localStorage')) {
  formEx = localStorage.getItem("formex");
  if (formEx) formEx = JSON.parse(formEx);
}

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
const inputmanual = () => {
  const manualSub = document.querySelector('#manualsub');
  manual.setAttribute("disabled", "disabled");
  manualSub.setAttribute("disabled", "disabled");
  const map = new google.maps.Map(document.querySelector('#map'), {
    zoom: 11,
    center: { lat: 40.79, lng: -115.6 }
  });
  map.addListener('click', (e) => {
  if (!addressmarker) placeMarker(e.latLng, map);
	});
  var addressmarker;
  function placeMarker(position, map) {
    manualSub.removeAttribute("disabled");
    addressmarker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true
    });
    map.panTo(position);
    google.maps.event.addListener(addressmarker, 'dragend', () => position = addressmarker.getPosition());
    manualSub.addEventListener('click', async (e) => {
      prompt({remove: true});
      let token = await getToken();
      manual.removeAttribute("disabled");
      e.preventDefault();
      address.lat = position.lat();
      address.lng = position.lng();
      let i = address;
      let j = `${verForm.action}?`;
      let status = await widthinZone({addr: address, token: token});
      if (status.result.length > 0) {
        let j = `${verForm.action}?`;
        sendData(`
          ${j}address=${i.address}
          &city=${i.city}&state=${i.state}&zip=${i.zip}
          &status=${status.result[0].status}
          &lat=${i.lat}&lng=${i.lng}
        `);
      } else {
        let markerStatus =  document.querySelector('#markerstatus');
        if (!markerStatus) {
          formStatus.innerHTML += `
          <p id="markerstatus" style="color:red;padding:7px;margin:7px 0;border:1px solid red;border-radius:5px;">
          It looks like you are outside of the current construction plan. Please <br>
          <a style="font-weight:bold;color:red!important;text-decoration:underline!important;" 
            href="https://anthembroadband.com/request-coverage/">click here</a> 
          to request future serve be brought to your location.<p>`;
        }
      }
    });
  }
}
const widthinZone = (data) => {
	let api = {
		url: `${agileUrl}fiber-tool/zone_status/?address=${data.addr.string}&project_id=v%3A58&o=5`,
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `JWT ${data.token}` }
	}
	
	if (data.addr.lat) api.url = `${api.url}&latitude=${data.addr.lat}`;
	if (data.addr.lng) api.url = `${api.url}&longitude=${data.addr.lng}`;

	return ajax(api);
}
const custVerifyAddress = async (firstTry=true) => {
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
    manual.classList.remove('hidden');
    formStatus.innerHTML = `
      <h5>We could not find your address or you are located outside of our active service area.</h5> 
      <p style="color:#000;">Please use a different method to locate your location.</p>
    `;
  }
  form(verForm).then( async val => {
    let next = document.querySelector('[name="next"]');
    btnLoader(next, true);
    let newVal = {};
    for (let i in val) {
      newVal[val[i].name] = val[i].field.value;
    }
    address.string = `${newVal.line1}, ${newVal.locality}, ${newVal.region} ${newVal.postal_code}`;
    address.address = newVal.line1;
    address.city = newVal.locality;
    address.state = newVal.region;
    address.zip = newVal.postal_code;
          
    let status = await widthinZone({addr: address, token: token});
    console.log(status);
    let i = address;
    if (status.result.length > 0) {
      if (formEx) {
        formEx.cnt = parseInt(formEx.cnt) + 1;
      } else {
        formEx = {
          cnt: 1,
          disabled: false
        }
      }
      
  // 			if (formEx.cnt > 2) {
  // 				if (!formEx.disabled) {
  // 					let dt = new Date();
  // 					dt.setHours( dt.getHours() + 1 );
  // 					formEx.disabled = true;
  // 					formEx.exp = dt;
  // 				}
  // 			}
      
      let j = `${verForm.action}?`;
      if (formEx) localStorage.setItem("formex", JSON.stringify(formEx));
      sendData(`
        ${j}address=${i.address}&city=${i.city}
        &state=${i.state}&zip=${i.zip}
        &status=${status.result[0].properties.Status}
        ${utmString}
      `);
      setTimeout(() => btnLoader(next, false), 8000);
    } else {
      custVerifyAddress(firstTry=false);
      btnLoader(next, false);
    }
  });
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

  if (document.querySelector('.verify-address')) custVerifyAddress();
    
	if (manual) {
		manual.addEventListener('click', (e) => {
			e.preventDefault();
			prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: mapContainer });
			inputmanual();
		});
	}
	window.addEventListener('scroll', () => {
		for (let i of navElements) {
			if (isInView(i.triggerElem)) {
				i.navElem.classList.add('active');
			} else {
				i.navElem.classList.remove('active');
			}
		}
  });
}

document.addEventListener("DOMContentLoaded", initMap);
// prompt({ background: 'rgb(255, 255, 255)', content: loader });
// navigation();
// checkbrowser();
// initMap();
// currentcustomer();
function initMap() {
    const stage = document.querySelectorAll('.pointer');
    const status = document.querySelector('.verify-address .status');
    const gps = document.querySelector('#gps');
    const manual = document.querySelector('#manual');
    const manualsubmit = document.querySelector('#manualsubmit');
    const request_coverage = document.querySelector('#requestCoverage');
    const geocoder = new google.maps.Geocoder();
    const today = new Date();
    const customer = {};
    const withinPolygon = (location, polygon) => google.maps.geometry.poly.containsLocation(location, polygon);
    const geocode = (address, callback) => geocoder.geocode({ 'address': address }, (results) => callback(results[0].geometry.location));
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: JSON.parse(zone.zoom),
        center: JSON.parse(zone.center)
    });
    const polygon = new google.maps.Polygon({
        fillColor: zone.color,
        fillOpacity: 0.35,
        strokeWeight: 0,
        paths: JSON.parse(zone.location),
        map: map
    });
    const validAddress = (res) => {
        console.log(res);
        let api = {
            url: `${window.location.origin}/wp-content/plugins/fiberzones/html/form.php`,
            method: 'get',
            res: 'text'
        }
        ajax(api).then(res => {
            prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: res });
            form(document.querySelector('.request-coverage')).then( values => {
                console.log(values);
            });
        });
    }
    const similarAddress = () => {

    }
    const statusBar = (width, elem, percent) => {
        const runInterval = () => {
            width++;
            elem.style.width = `${width}%`;
            elem.innerHTML = `${width * 1}%`;
        }
        let id = setInterval(() => width >= percent ? clearInterval(id) : runInterval(), 100); 
    }
    const getDate = (date) => {
        let i = date.split('-');
        return new Date(`${i[1]}/${i[2]}/${i[0]}`);
    }
    const verifyAddress = (firstTry=true) => {
        if (firstTry == false) {
            gps.classList.remove('hidden');
            manual.classList.remove('hidden');
            request_coverage.classList.remove('hidden');
            status.innerHTML = `<h5>We could not find your address or you are located outside of our active service area.</h5> 
            <h6>Please use a different method to locate your location.</h6>`;
        }
        form(document.querySelector('.verify-address')).then( val => {
            const callback = (res) => withinPolygon(res, polygon) ? validAddress(res) : verifyAddress(firstTry=false);
            customer.address = val[0].field.value;
            customer.city = val[1].field.value;
            customer.state = val[3].field.value;
            customer.zip = val[2].field.value;
            let address = geocode(`${val[0].field.value} ${val[1].field.value}, ${val[3].field.value} ${val[2].field.value}`, callback);
        });
    }
    const inputgps = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(location => {
            let geoLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
            withinPolygon(geoLocation, polygon) ? validAddress(geoLocation) : verifyAddress(firstTry=false);
        });
    }
    const inputmanual = (e) => {
        e.preventDefault();
        map.setMapTypeId('satellite');
        polygon.setVisible(false);
        marker.hide();
        map.addListener('click', (e) => {if (!addressmarker) placeMarker(e.latLng, map)});
        var addressmarker;
        function placeMarker(position, map) {
            addressmarker = new google.maps.Marker({
                position: position,
                map: map,
                draggable: true
            });
            map.panTo(position);
            google.maps.event.addListener(addressmarker, 'dragend', () => position = addressmarker.getPosition());
            manual.classList.add('hidden');
            manualsubmit.classList.remove('hidden');
            manualsubmit.addEventListener('click', e => {
                e.preventDefault();
                withinPolygon(position, polygon) ? validAddress(position) : verifyAddress(firstTry=false);
            });
        }
    }
    document.querySelector('.counter').innerHTML = daysBetween(today, getDate(zone.startdate));
    for (let i of stage) if (i.classList.contains(zone.stage)) i.classList.add('active');
    for (let i of zone.contacts) if (i.location !== '') i.location = JSON.parse(i.location);
    let current = statusBar(1, document.getElementById('myBar'), Math.floor(zone.contacts.length / zone.goal * 100));
    const marker = new Marker(zone.contacts, map);
    marker.create();
    if (children.length > 0) {
        const childrenPoli = []
        for (let i of children) {
            childrenPoli.push(new google.maps.Polygon({
                fillColor: i.color,
                fillOpacity: 0.35,
                strokeWeight: 0,
                paths: JSON.parse(i.location),
                map: map
            }));
        }
        console.log(children);
        if (children.contacts.length > 0) {
            for (let i of children.contacts) if (i.location !== '') i.location = JSON.parse(i.location);
            const childmarkers = new Marker(children.contacts, map);
            childmarkers.create();
        }
    }

    verifyAddress();
    gps.addEventListener('click', inputgps);
    manual.addEventListener('click', inputmanual);
}
function doNothing() {}

function displaymap(data, map) {
    map.setMapTypeId('roadmap');
    polygon.setVisible(true);
}

function checkpolygon(customer) {
    Object.values(address).forEach( function(key) {    key.style.border = "none";   });
    status.innerHTML = '';
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(customer.location.lat, customer.location.lng), data.zone.obj)) {
        console.log(customer);
        delete customer.status;
        let address = `${customer.address} ${customer.city}, ${customer.state_long} ${customer.zip}`;
        let similar = [];
        let same = [];
        for (let a of data.contacts) {
            let fulladdress = `${a.address} ${a.city}, ${a.state} ${a.zip}`;
            let validate = levenshtein(address.toLowerCase(), fulladdress.toLowerCase());
            if (validate < 5 && validate > 0) {
                similar.push(a);
            } else if (validate === 0) {
                same.push(a);
            }
        }
        if (same.length > 0) {
            customer.id = same[0].id;
            callback();
        } else if(similar.length > 0) {
            // let content = `<h3>Similar addresses</h3>`;
            // for (let d of similar) content += `<div>${d.address} ${d.city}, ${d.state} ${d.zip}</div>`;
            //prompt({ background: 'rgba(0, 0, 0, 0.8)', container: 'popup', content: content }); 
            callback();
        } else {
            let api = {
                body: `action=post_contact&data=${JSON.stringify(customer)}`,
                url: fz_post_contact.ajax_url,
                report: true
            }
            ajax(api).then(function (res) {
                console.log(res);
                customer.id = res.mysql.id;
                callback();
            });
        }
        
        function callback() {
            
            prompt({ container: 'popup', background: 'rgba(0, 0, 0, 0.8)', content: options.stepform });
            let productline = document.querySelector('#productline');
            productline.addEventListener('click', productlineevent);
            productlineevent();
            function productlineevent() {
                let plans = document.querySelector('#packages');
                let commitment = document.querySelector('#commitment');
                if (document.querySelector('#business_name')) {
                    let elem = document.querySelector('#business_name');
                    elem.parentNode.removeChild(elem);
                }
                if (productline.checked) {
                    let productlineblock = document.querySelector('#productlineblock');
                    productlineblock.insertAdjacentHTML("afterend", `<input id="business_name" name="business_name" class="business_name half" type="text" placeholder="Business Name" size="9" data-visible=" Business Name" required>`);
                    plans.innerHTML = options.commercial_pack;
                    commitment.innerHTML = options.commercial_opt;
                } else {
                    plans.innerHTML = options.residential_pack;
                    commitment.innerHTML = options.residential_opt;
                }

            }
            
        }
            
    } else {
        Object.values(address).forEach( function(key) { key.style.border = "1px solid red"; });
        status.innerHTML = customer.status;
        gps.classList.remove('hidden');
        manual.classList.remove('hidden');
        request_coverage.classList.remove('hidden');
    }
    
    // displaymap(data, map);
}
function inputgeocode(a) {
    customer.status = '<h4>We could not find your address or you are located outside of our active service area.</h4> <h5>Please use a different method to locate your location.</h5>';
    let fulladdress = `${a.address} ${a.city}, ${a.state} ${a.zip}`;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': fulladdress }, function (results, status) {
        if (status == 'OK') {
            customer.location = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
            var a = results[0].address_components;
            for(let i of a) {
                if (i.types[0] === 'administrative_area_level_1' ) {
                    customer.state_long = i.long_name;
                    customer.state_short = i.short_name;
                }                   
            }
            delete customer.state;
            checkpolygon(customer);
        }
    });
}
function activebtn() {
    var clicked = document.querySelectorAll('.top div');
    for (let i = 0; i < clicked.length; i++) {
        clicked[i].addEventListener("click", sfclient_assign_values);
    }
    function sfclient_assign_values() {
        var all = document.querySelectorAll('[name=displaylist]');
        var selectedp = document.querySelectorAll('.info .bottom div');
        for (let i = 0; i < all.length; i++) {
            all[i].classList.remove('active');
        }
        for (let i = 0; i < selectedp.length; i++) {
            if (selectedp[i].classList.contains(this.id) == true) {
                this.classList.add('active');
                selectedp[i].classList.add('active');
            }
        }
    }
}
function daysBetween(date1, date2) {
    var difference_ms = date2.getTime() - date1.getTime();
    difference_ms = difference_ms / 1000;
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    return ' ' + ("0" + days).slice(-2) + ' : ' + ("0" + hours).slice(-2) + ' : ' + ("0" + minutes).slice(-2) + ' '; // Convert back to days and return   
}
function levenshtein(str1, str2) {
    var cost = new Array(), n = str1.length, m = str2.length, i, j;
    const minimum = (a, b, c) => {
        var min = a;
        if (b < min) min = b;
        if (c < min) min = c;
        return min;
    }
    if (n == 0) return;
    if (m == 0) return;
    for (var i = 0; i <= n; i++) cost[i] = new Array();
    for (i = 0; i <= n; i++)  cost[i][0] = i;
    for (j = 0; j <= m; j++) cost[0][j] = j;

    for (i = 1; i <= n; i++) {
        var x = str1.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            var y = str2.charAt(j - 1);
            x == y ? cost[i][j] = cost[i - 1][j - 1] : cost[i][j] = 1 + minimum(cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j]);
        } //endfor
    } //endfor
    return cost[n][m];
}
class Marker {
    constructor(obj, map) {
        this.list = obj;
        this.markers = [];
        this.map = map;
    }
    create() {
        if ( this.list.length > 0 ) {
            for (let i of this.list) {
                let marker = new google.maps.Marker({
                    position: i.location,
                    map: this.map
                });
                this.markers.push(marker);
            }
        }
    }
    hide() {
        for (let i of this.markers) i.setVisible(false);
    }
    show() {
        for (let i of this.markers) i.setVisible(true);
    }
}
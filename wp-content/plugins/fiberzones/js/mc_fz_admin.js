document.addEventListener("DOMContentLoaded", initMap);
function initMap() {
    const reload_page = () => location.reload();
    const zoneselect = document.querySelectorAll('.select-zone');
    const newzone = document.querySelector('#new-zone');
    const close = document.querySelector('.close');
    const cancel = document.querySelector('#cancel');
    const zoneform = document.querySelector('#zoneform');
    const current = document.querySelector('#currentctm');
    const total = document.querySelector('#totalctm');
    const map = new google.maps.Map(document.getElementById("map"));
    const editors = ['header', 'details', 'smallprint'];
    const newPolygon = (path) => {
        const bounds = new google.maps.LatLngBounds();
        let location = [];
        for (let i = 0 ; i < path.length; i++) bounds.extend(path.getAt(i));
        let center = { lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() }
        console.log(center);
    }
    const statusBar = (width, elem, percent) => {
        const runInterval = () => {
            width++;
            elem.style.width = `${width}%`;
            elem.innerHTML = `${width * 1}%`;
        }
        let id = setInterval(() => width >= percent ? clearInterval(id) : runInterval(), 100); 
    }
    const prop = {
        id: document.querySelector('#id'),
        name: document.querySelector('#name'),
        startdate: document.querySelector('#startdate'),
        enddate: document.querySelector('#enddate'),
        goal: document.querySelector('#goal'),
        price: document.querySelector('#price'),
        whale: document.querySelector('#whaleprice'),
        header: tinyMCE.editors['header'],
        header_text: document.querySelector('#header'),
        details: tinyMCE.editors['details'],
        details_text: document.querySelector('#details'),
        smallprint: tinyMCE.editors['smallprint'],
        smallprint_text: document.querySelector('#smallprint'),
        stage: document.querySelector('#stage'),
        zoom: document.querySelector('#zoom'),
        color: document.querySelector('#color'),
        parent: document.querySelector('#parent'),
        center: document.querySelector('#center'),
        location: document.querySelector('#location'),
    }
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        map: map,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon']
        },
        polygonOptions: {
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            strokeWeight: 0,
            draggable: true,
            clickable: true,
            editable: true
        }
    });
    const polygon = new google.maps.Polygon({
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        strokeWeight: 0, 
        draggable: true,
        editable: true
    });
    function get() {
        let api = {
            body: `action=get_zone&id=${this.getAttribute("data-id")}`,
            method: 'post',
            url: fz_get_zone.ajax_url
        }
        ajax(api).then(res => updateForm(prop, res));
    }
    form(document.querySelector(".zone-form")).then( data => {
        let values = {}
        data.forEach(i => values[i.field.name] = i.field.value);
        editors.forEach(i => values[i] = tinyMCE.get(i) ? tinyMCE.get(i).getContent() : prop[`${i}_text`].value);
        let api = {
            body: `action=post_zone&data=${JSON.stringify(values)}`,
            url: fz_post_zone.ajax_url,
            method: 'POST',
            report: true
        }
        ajax(api).then(res => window.location.replace(document.querySelector(".zone-form").action));
    });
    function updateForm(prop,zone=false) {
        if (zone) {
            statusBar(1, document.getElementById('myBar'), Math.floor(zone.contacts.length / parseInt(zone.goal) * 100));
            current.innerHTML = zone.contacts.length;
            total.innerHTML = zone.goal ? zone.goal : '';
            polygon.setPath(JSON.parse(zone.location));
            polygon.setOptions({fillColor: zone.color});
            polygon.setMap(map);
            zone.center = JSON.parse(zone.center);
            zone.zoom = parseInt(zone.zoom);
            if (zone.contacts.length > 0) {
                for (let i of zone.contacts) {  
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(JSON.parse(i.location)),
                        map: map
                    });
                }
            }
        }
        map.setCenter(zone ? zone.center : { lat: 43.491650, lng: -112.033966 });
        map.setZoom(zone ? zone.zoom : 6);
        prop.id.value = zone.id ? zone.id : 0;
        prop.name.value = zone.name ? zone.name : '';
        prop.startdate.value = zone.startdate ? zone.startdate : '';
        prop.enddate.value = zone.enddate ? zone.enddate : '';
        prop.goal.value = zone.goal ? zone.goal : '';
        prop.price.value = zone.price ? zone.price : '';
        prop.whale.value = zone.whale ? zone.whale : '';
        prop.zoom.value = zone.zoom ? zone.zoom : '';
        prop.color.value = zone.color ? zone.color : '';
        prop.center.value = zone.center ? JSON.stringify(zone.center) : '';
        prop.location.value = zone.location ? zone.location : '';
        editors.forEach(i => tinyMCE.get(i) ? tinyMCE.get(i).setContent(zone[i] ? zone[i] : '') : prop[`${i}_text`].value = zone[i] ? zone[i] : '');
        zone.parent ? document.querySelector(`#parent option[value="${zone.parent}"]`).setAttribute('selected', '') : prop.parent.removeAttribute("selected");
        zone.stage ? document.querySelector(`#stage option[value=${zone.stage}]`).setAttribute('selected', '') : prop.stage.removeAttribute("selected");
        zoneform.style.display = 'block';
    }
    function polygonevents(e) {
        let path = e.overlay ? e.overlay.getPath() : this.getPath();
        let location = [];
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0 ; i < path.length; i++) {
            bounds.extend(path.getAt(i));
            location.push({  lat: path.getAt(i).lat(),  lng: path.getAt(i).lng() });
        }
        prop.center.value = JSON.stringify({ lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() });
        prop.location.value = JSON.stringify(location);
    }

    google.maps.event.addListener(drawingManager, 'overlaycomplete', polygonevents);
    google.maps.event.addListener(map, 'zoom_changed', () => prop.zoom.value = map.zoom);
    google.maps.event.addListener(drawingManager, 'dragend', polygonevents);
    google.maps.event.addListener(polygon, 'dragend', polygonevents);
    google.maps.event.addListener(polygon, 'insert_at', polygonevents);
    google.maps.event.addListener(polygon, 'remove_at', polygonevents); 
    newzone.addEventListener('click', () => updateForm(prop));
    close.addEventListener('click', () => zoneform.style.display = 'none');
    cancel.addEventListener('click', () => zoneform.style.display = 'none');
    if (zoneselect.length > 0) for (let i of zoneselect) i.addEventListener('click', get);
}
function doNothing() {}
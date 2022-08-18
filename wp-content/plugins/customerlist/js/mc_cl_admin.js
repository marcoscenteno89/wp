var results = { 
  customers_active: false, 
  customers_nonactive: false, 
  leads_leads: false, 
  leads_wonoshot: false, 
  leads_wocancelled: false, 
  leads_womaxap: false, 
  leads_wolosttocompetitor: false, 
  all: false, 
  keyword: false
};
var customers;
function resetvalues() {
    results.all = false;
    results.leads_leads = false;
    results.leads_wocancelled = false;
    results.leads_wolosttocompetitor = false;
    results.leads_womaxap = false;
    results.leads_wonoshot = false;
    results.customers_active = false;
    results.customers_nonactive = false;
    results.keyword = false;
    jQuery('.keywordhidden').hide();
    jQuery('.ctmhidden').hide();
    jQuery('.leadshidden').hide();
}
function initMap() {
  displaymap();
  jQuery('.update').on('click', sqlrequest);
  jQuery('.customers, .leads').on('click', assingvalues);
  jQuery('.cstdisplay').on('change', function(){
    cstdisplay = jQuery('.cstdisplay:checked').val();
    if ( cstdisplay === 'customers' ) {
        resetvalues();
        jQuery('.leads').prop('checked', false);
        jQuery('.ctmhidden').show();
    } else if ( cstdisplay === 'leads' ) {
        resetvalues();
        jQuery('.customers').prop('checked', false);
        jQuery('.leadshidden').show();
    } else if ( cstdisplay === 'all' ) {
        resetvalues();
        results.all = true;
    } else if (cstdisplay === 'keyword') {
        resetvalues();
        results.keyword = true;
        jQuery('.keywordhidden').show();
    } else {}
  });
}
function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}
function doNothing() {}
function displaymap() {
  var map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 43.578123, lng: -114.356629},
      zoom: 8,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
  });
  if (jQuery('.fiberring').is(':checked')) {
    var kmlLayer = new google.maps.KmlLayer({
      url: '/wp-content/plugins/customerlist/utilities/10GigRing.kmz',
      map: map,
      suppressInfoWindows: true,
      preserveViewport: false
    });
  }
  if (jQuery('.towers').is(':checked')) {
    downloadUrl('/wp-content/plugins/customerlist/utilities/Towers.kml', function(data) {
      var xml = data.responseXML;
      var markers = xml.documentElement.getElementsByTagName('Placemark');
      Array.prototype.forEach.call(markers, function(markerElem) {
        var name = markerElem.getElementsByTagName('name')[0].innerHTML;
        var coordinates = markerElem.getElementsByTagName('coordinates')[0].innerHTML;
        coordinates = coordinates.replace(/,/g, ', ');             
        coordinates = coordinates.substring(0, coordinates.lastIndexOf(','));
        coordinates = coordinates.split(' ');
        var lat = coordinates[1];
        var lng = coordinates[0].slice(0, -1);
        var point = new google.maps.LatLng(lat, lng);
        var icon = {
          url: "/wp-content/plugins/customerlist/img/green-dot.png",
          scaledSize: new google.maps.Size(17, 17),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(0, 0)
        };
        var marker = new google.maps.Marker({
          map: map,
          position: point,
          label: {
            text: name,
            strokeWeight: 1,
            fontSize: '6px',
            strokeColor: '#FFFFFF'
          },
          icon: icon
        });
        var infowindow = new google.maps.InfoWindow({
          content: name
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      });
    });
  }
  //var infowindow = new google.maps.InfoWindow();
  var markers = customers.map( function(customer) {
      var contentString = '<b>'+customer.Name+'</b><br> '+customer.Status+'<br>'+customer.Address;
      var imagepathurl = '/wp-content/plugins/customerlist/img/red.png';
      csticon = {
        url: imagepathurl,
        scaledSize: new google.maps.Size(10, 10),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, 0)
      };

      var marker = new google.maps.Marker({
        position: { lat: customer.lat, lng: customer.lng },
        map: map,
        icon: csticon
      });       
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
      return marker;
  });
  var markerCluster = new MarkerClusterer(map, markers, {
    imagePath: '/wp-content/plugins/customerlist/img/m'
  });
}
function assingvalues() { 
  var currentcheckbox = jQuery(this)[0];
  var checkboxname = jQuery(this).val();
  if (currentcheckbox.checked === true) {
    results[jQuery(this).val()] = true;
  } else {
    results[jQuery(this).val()] = false;
  }
  return(results);
}
function sqlrequest() {
  console.log('works till here');
    if (results.keyword === true) {
      results.keyword = jQuery( '#keys' ).val();
    }
    jQuery.ajax({
        type: 'POST',
        dataType: "text",
        url: sqlrequest_ajax.ajax_url,
        data: {
          action: 'sqlrequest',
          sqlstmt: results
        },
        success: function( result ) {
            if ( result == '' ) {
              customer = [];
            } else {
              customers = JSON.parse(result);
            }
            displaymap(customers);
            resetvalues();
        },
        error: function(error) {
          console.log(error);
        }
    });
}


function placeColorCodedMarker (AQDescription, MapVar, lat, lon) {

    // takes the assigned air quality description as well as a map object and set of coordinates
    // and adds a marker to the given map object and returns that marker 

    if (AQDescription == 'good' ) {
        // air quality 
        return L.marker([lat, lon], {icon: greenIcon}).addTo(MapVar);
    } else if (AQDescription == 'moderate') {
        return L.marker([lat, lon], {icon: yellowIcon}).addTo(MapVar);
    } else if (AQDescription == 'unhealthy for sensitive groups') {
        return L.marker([lat, lon], {icon: yellowIcon}).addTo(MapVar);
    } else if (AQDescription == 'unhealthy') {
        return L.marker([lat, lon], {icon: orangeIcon}).addTo(MapVar);
    } else if (AQDescription == 'very unhealthy') {
        return L.marker([lat, lon], {icon: redIcon}).addTo(MapVar);
    } else if (AQDescription == 'hazardous') {
        return L.marker([lat, lon], {icon: violetIcon}).addTo(MapVar);
    } else {
        return L.marker([lat, lon]).addTo(MapVar);
    }
}



// Map Icon Variables ***********************************************************************************************************************************************************
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//Example code for adding to map:
// L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

//****************************************************************************************************************************************************************************************************

// function that displays the newly clicked latitude and longitude, allowing them to update the marker position.
function onMapClick(e) {
    if(updateMarker === true){
        if(locationRadii.length > 0){
            mymap.removeLayer(locationRadii[locationRadii.length - 1]);
            locationRadii.pop();
        }
        if (mapMarkers.length > 1) {
            mymap.removeLayer(mapMarkers[mapMarkers.length - 1]);
            mapMarkers.pop();
        } else {
            mymap.addControl(new customControl());
        }
        console.log(e.latlng);
        popup_string = "New callout location selected. Click 'update' below to update to the corrected location."
    
        mapMarkers.push(L.marker(e.latlng, {icon: greenIcon}).addTo(mymap)
            .bindPopup(popup_string).openPopup());
    
        circle_Color = "green"
        locationRadii.push(L.circle(e.latlng, minLocationRadius, {
            color: circle_Color,
            fillColor: circle_Color,
            filOpacity: 0.2,
        }).addTo(mymap));


    } else {
        updateMarker = true;
    }


}



// custom control code found online:
var customControl =  L.Control.extend({        
    options: {
      position: 'bottomleft',
    //   buttonType: buttonCount
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('input');
        var buttonType, buttonTitle, buttonVal, overColor, outColor, overTxt, outTxt;

        container.type="button";

        overTxt = 'white';
        outTxt = 'black';
        if (buttonCount === 0){
            buttonType = 0;
            buttonTitle = 'Cancel adding the current callout and start over.';
            buttonVal = 'Cancel';
            overColor = 'Azure';
            outColor = 'white';
            overTxt = 'black';
        } else if (buttonCount ===1){
            buttonType = 1;
            buttonTitle = 'Confirm the original marker (blue) location and continue submission of callout.';
            buttonVal = 'Submit Location';
            overColor = 'blue';
            outColor = 'white';
        } else if (buttonCount ===2){
            buttonType = 2;
            buttonTitle = 'Confirm the updated marker (green) location and continue submission of callout.';
            buttonVal = 'Submit Updated';
            overColor = 'green';
            outColor = 'white';
        }

        container.title = buttonTitle;
        container.value = buttonVal;
        buttonCount += 1;

        container.onmouseover = function(){
            container.style.backgroundColor = overColor; 
            container.style.color = overTxt;
        }
        
        container.onmouseout = function(){
            container.style.backgroundColor = outColor; 
            container.style.color = outTxt;
        }

        container.onclick = function(){
            updateMarker = false;
            if(buttonType === 0){
                console.log('cancelling');
                captureBase64 = ""
                localStorage.setItem("calloutData", captureBase64);
                window.location = "index.html"
            } else if (buttonType === 1) {
                console.log('submitting')
                lat = mapMarkers[0].getLatLng().lat;
                lon = mapMarkers[0].getLatLng().lng;

                if(mapMarkers[0].getLatLng().lat === defaultLatLng[0] && mapMarkers[0].getLatLng().lng === defaultLatLng[1] ){
                    alert("Geolocation did not work with your device, please select an updated location on the map indicating where the callout is located then select 'Submit Updated'");
                } else {
                    localStorage.setItem("calloutData", localStorage.getItem("calloutData") + ',' + lat + ',' + lon);
                    window.location = "calloutConfirm.html"
                }

            } else if (buttonType === 2) {
                console.log('submitting update')
                lat = mapMarkers[1].getLatLng().lat;
                lon = mapMarkers[1].getLatLng().lng;
                
                localStorage.setItem("calloutData", localStorage.getItem("calloutData") + ',' + lat + ',' + lon);
                window.location = "calloutConfirm.html"
            }

        }

        return container;
    }
  });



 
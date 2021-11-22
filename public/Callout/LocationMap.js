let  lat, lon;
let detectedLocation;


// MAKING A MAP AND TILES
const defaultLatLng = [40.441636, -80.010978];
const mymap = L.map('calloutMap').setView(defaultLatLng, 10);
        
// Attribution to open street map for using their map tiles:
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, { attribution });
//Add the tiles to the map div dom element
tiles.addTo(mymap);

let mapMarkers = [];
let locationRadii = [];
const minLocationRadius = 35;
var updateMarker = true;
var buttonCount = 0;

mymap.addControl(new customControl(buttonCount));
mymap.addControl(new customControl());
mymap.locate({setView: true, maxZoom: 17});

function onLocationFound(e) {
    var radius = e.accuracy;

    let popup_string, circle_Color;
    if (radius > minLocationRadius) {
        popup_string = `Callout image capture detected within the ${Math.round(radius)} meter radius shown. The current reading is not percise, ` + 
            "and location of the stormwater issue may be difficult to find. If the marker location does not correspond with the location of the photo please click the proper location on the map."
        circle_Color = "red"
    } else {
        popup_string = `Callout image capture was detected within the shown ${Math.round(radius)} meter radius. 
            If the shown location is not correct please click the proper location on the map.\n\n
            OTHERWISE: Click 'Submit Location' below to continue.`
        circle_Color = "blue"
    }

    mapMarkers.push(L.marker(e.latlng).addTo(mymap)
        .bindPopup(popup_string).openPopup());

    lat = e.latlng.lat;
    lon = e.latlng.lng;

    locationRadii.push(L.circle(e.latlng, radius, {
        color: circle_Color,
        fillColor: circle_Color,
        filOpacity: 0.2,
    }).addTo(mymap));

    console.log(e.latlng);
}

function onLocationError(e) {
    alert(e.message);
    mapMarkers.push(L.marker(defaultLatLng).addTo(mymap)
        .bindPopup("No geolocation detected. Please place a marker in the proper location by clicking on the map. The marker should be as close to the location of the callout as possible. ").openPopup());
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);
mymap.on('click', onMapClick);


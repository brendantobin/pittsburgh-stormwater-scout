
var databaseVisible = false;
let databaseList;
let dataDivElements = [];

// MAKING A MAP AND TILES
const defaultLatLng = [40.441636, -80.010978];
const mymap = L.map('checkinMap').setView(defaultLatLng, 10);
        
// Attribution to open street map for using their map tiles:
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, { attribution });
//Add the tiles to the map div dom element
tiles.addTo(mymap);
let mapMarkers = [];

async function getData(){
    console.log('begin database retrieval')
    const response = await fetch('../api');
    const data = await response.json();

    for (item of data) {
        const dateString = new Date(item.timestamp).toLocaleString();
        const linebreak = document.createElement("br");

        // const markerText = `Checkin from: ${dateString}.${linebreak}<br>
        //     Reported Issue: [${item.UserCalloutInput}]${linebreak}<br>
        //     The weather forcast was: ${item.forecast_string} with a temperature of ${item.temperature_string}.`

        
        const markerText = "Checkin from: " + dateString 
            + "<br>Reported Issue: '" + item.UserCalloutInput 
            + "'<br>The weather forcast was: " + item.forecast_string 
            + " with a temperature of " + item.temperature_string;
        
        mapMarkers.push(L.marker([item.lat, item.lon]).addTo(mymap)
            .bindPopup(markerText).on('click', onMarkerClick));
    }            
}

getData();

function onMarkerClick(e) {
    if(databaseVisible === true){
        for(eachChild of databaseList.children){
            if(eachChild.children[1].textContent === e.latlng.lat + ',' + e.latlng.lng){
                const docMap = document.getElementById('checkinMap');
                docMap.scrollIntoView({behavior: "auto", block: "nearest", inline: "end"});
                eachChild.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

                this.closePopup();
                mymap.flyTo(this.getLatLng(), 16);
                                
                // because of the screen size on mobile the following will adjust the zoom to properly if the user is on a mobile device:
                var isMobile = false; //initiate as false
                isMobile = checkIfMobile();
                
                if(isMobile){
                    window.scrollBy(0,-160);
                }
                return
            }
        }
    } 
}

const listButton = document.getElementById('DatabaseList');
listButton.addEventListener('click', async event => {
    if (databaseVisible == false){
        console.log('begin database retrieval')
        const response = await fetch('../api');
        const data = await response.json();
        const rootBase = document.createElement('div');
        // rootBase.id = "databaseList";
        databaseList = rootBase;

        rootBase.style="overflow:auto; height:400px";

        for (item of data) {
            const root = document.createElement('div');

            const linebreak = document.createElement("br");
            const lineSeparator = document.createElement('div');
            lineSeparator.textContent = '------------------------------------------------';

            const geo = document.createElement('div');
            const date = document.createElement('div');
            const calloutText = document.createElement('div');
            const userWeather = document.createElement('div');
            const apiWeather = document.createElement('div');
            const airQuality = document.createElement('div');
            const imageTitle = document.createElement('div');

            const image = document.createElement('img');
            image.className = "dataImages";
            const dateString = new Date(item.timestamp).toLocaleString();
            date.textContent = `logged on: ${dateString}`;

            geo.textContent = `${item.lat},${item.lon}`;
            calloutText.textContent = `Callout text: '${item.UserCalloutInput}'`
            if(!item.UserWeatherInput == ""){
                userWeather.textContent = `user weather input: '${item.UserWeatherInput}'`
            }
            apiWeather.textContent = `api weather: ${item.forecast_string} at ${item.temperature_string}`;
            airQuality.textContent = `api air quality: ${item.aq_description}, pm2.5 = ${item.aq_value} ${item.aq_unit}`;
            imageTitle.textContent = 'Image Submitted:'
            image.src = item.photoData;
            root.append(date, geo, calloutText, userWeather, apiWeather, airQuality, imageTitle, image, linebreak, lineSeparator, linebreak);
            root.append(linebreak);
            rootBase.append(root);
            
        }
        document.body.append(rootBase);
        dataDivElements.push(rootBase);

        databaseVisible = true;              
    } else {
        for (i = dataDivElements.length - 1; i >= 0; i--){
            dataDivElements[i].remove();
        }
        databaseVisible = false;
    }

    if(listButton.value == "Show Database List"){
        listButton.value = "Hide Database List";
    } else {
        listButton.value = "Show Database List"
    }

});
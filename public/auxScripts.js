function rateAQ (AQValue) {
    // takes in the airquality value read in from api 
    // and returns a description of the air quality 

    // air quality category set as per chart found on airnow.gov; 24-hr pm 2.5
    // colors assigned independent of airnow.gov and are not an official coloring scheme
    // green = good
    // yellow = moderate - unhealthy for sensitive groups
    // orange = unhealthy
    // red = very unhealthy
    // violet = hazardous

    if (AQValue <= 12.0 ) {
        // air quality 
        return 'good';
    } else if (AQValue <= 35.4 ) {
        return 'moderate';
    } else if (AQValue <= 55.4 ) {
        return 'unhealthy for sensitive groups';
    } else if (AQValue <= 150.4 ) {
        return 'unhealthy';
    } else if (AQValue <= 250.4 ) {
        return 'very unhealthy';
    } else if (AQValue <= 350.4) {
        return 'hazardous';
    } else if (AQValue <= 500.4) {
        return 'hazardous';
    } else {
        return 'air quality description error'
    }

}

async function apiCalls() {  
    let api_json = [];
    // save geolocation and use that to make calls to the weather and air quality api's 
    try{
        const api_url = `../weather/${lat},${lon}`;
        const response = await fetch(api_url);
        api_json = await response.json();
        console.log(api_json);

    } catch(error) {
        console.log('something went wrong with using the geolocation to retrieve api data');
        document.getElementById('forecast').textContent = 'forecast requires geolocation';
    }
    
    // save the weather api data that was retrieved above
    // and display the data on the web page
    try{
        let weather_data = api_json.weather_forecast;
        forecast_string = `${weather_data.weather[0].description}`;
        temperature_string = `${weather_data.main.temp}°F`;

        document.getElementById('forecast').textContent = forecast_string;
        document.getElementById('temperature').textContent = temperature_string;
    } catch(error) {
        forecast_string = 'no forcast available';
        temperature_string = 'no temperature data available';
        console.log('something went wrong with retreiving the weather forecast');
        document.getElementById('forecast').textContent = '[no forecast available]';
        document.getElementById('temperature').textContent = '[no temperature reading available]';
    }
    // save the air quality data that was retrieved and display it for the user
    try{
        let air_data = api_json.air_quality.results[0];
        let measurement_index = 0;
        for (item of air_data.measurements) {
            if (item.parameter == "pm25"){
                //if the pm 25 measurement is found, use that as the pm 2.5 air quality indicator
                break;
            }
            measurement_index += 1;
        }

        // re-assign air_data to use the proper pm2.5 index
        air_data = air_data.measurements[measurement_index];

        // use the rateAQ function from mapScripts.js to assign an air quality rating
        // and place a color coded pin at the location
        aq_description = rateAQ(air_data.value);
        aq_value = air_data.value;
        aq_unit = air_data.unit;
        air_string = `${aq_description}, pm 2.5 reading = ${aq_value} ${aq_unit}`;
        document.getElementById('air_quality').textContent = air_string;
    } catch(error) {
        aq_description = 'no air quality data available';
        aq_value = 0;
        aq_unit = '';
        console.log('something went wrong with retreiving the air quality');
        document.getElementById('air_quality').textContent = '[no reading available]';
        console.log('Error placing location on to map.')
        console.log("Error", error.stack);
        console.log("Error name & message = [", error.name, ':', error.message, "]");
        
    }
        
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
    
// device detection
function checkIfMobile(){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        return true;
    }
}

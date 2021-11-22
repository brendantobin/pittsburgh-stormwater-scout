let  lat, lon;

// used to save the data from the weather API
let forecast_string, temperature_string;

// used to save the data from the Air Quality API and
// used to classify the air quality reading from good to hazardous:
let aq_description, aq_value, aq_unit;

let UserWeatherInput, UserCalloutInput, UserComments, UserEmail;

// the photo data and the lat lon data from the previous two pages are saved in local storage
// the following code extracts, parses , and saves them:
var calloutData = localStorage.getItem("calloutData");
calloutData = calloutData.split(',');

const photoData = calloutData[0] + ',' + calloutData[1];
lat = calloutData[2];
lon = calloutData[3];
// the photo/lat/lon data should be properly carried over after the above line


document.getElementById("calloutImage").src=photoData;
document.getElementById('latitude').textContent = lat;
document.getElementById('longitude').textContent = lon;

// call apiCalls function from Auxillary Scripts to get data from APIs
apiCalls();



const SubmitButton = document.getElementById('SubmitCallout');
SubmitButton.addEventListener('click', async event => {
    
    UserWeatherInput = document.getElementById('txaWeather').value;
    UserCalloutInput = document.getElementById('txaCalloutDescr').value;
    UserComments = document.getElementById('txaComments').value;
    UserEmail = document.getElementById('txaEmail').value;

    console.log(UserWeatherInput, UserCalloutInput, UserComments, UserEmail);

    // test to make sure user entered into the required fields:
    if (UserCalloutInput === ""){
        alert("No Callout Description: in order to submit a callout to a stormwater issue you must provide a description of the issue that you witnessed.")
    } else if (UserEmail === ""){
        alert("No Email Provided: in order to submit a callout to a stormwater issue you must provide a valid email address.")
    } else {

        //test if valid email address (basic test does not acctually send a validation email or anything, just checks format)
        if(validateEmail(UserEmail)){
            const data = {lat, lon, UserCalloutInput, forecast_string, temperature_string, UserWeatherInput, aq_description, aq_value, aq_unit,  UserComments, UserEmail, photoData};
            // in order to send a post we need a second argument, a JSobject
            // set as a variable, options:
            // various options can be established, see here https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
            const options = {
                // defines as a post request
                method: 'POST',
                // A header is packaged with post or get request, a way of adding meta information with these methods
                headers: {
                'Content-Type': 'application/json'
                },
                // body is a key component, converts json to a string to be sent
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            };
            const db_response = await fetch('/api', options);
            const db_jsonData = await db_response.json();
            console.log(db_jsonData);


            // Callout finished and submitted to database. Clear data and send user to callout Logs page
            alert("Callout information logged to database! Thank you for your help!")
            calloutData = ""
            localStorage.setItem("calloutData", calloutData);
            window.location = "../Callout_Log/index.html"
        } else {
            alert("Invalid Email Address: The format of your email address was not recognized, please try again or use a more 'standard' format.")
        }
    }
});


const CancelButton = document.getElementById('returnToCallout');
CancelButton.addEventListener('click', async event => {
    calloutData = ""
    localStorage.setItem("calloutData", calloutData);
    window.location = "/Callout/index.html"
});
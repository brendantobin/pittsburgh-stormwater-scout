const express = require('express');
const Datastore =  require('nedb');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

const app = express();

// // ADD THIS BACK IN
// const port = process.env.PORT || 3000;

// // this works but does not allow geolocation from secure origin
app.listen(3000, '192.168.86.150', () => console.log('listening at 3000'));

// app.listen(3000, () => console.log('listening at 3000'));



// //ADD THIS BACK IN
// app.listen(port, () => {
//     console.log(`Starting server at ${port}`);
// });

const database = new Datastore('database.db');
database.loadDatabase();

// what is the purpose of this server?

// 1. to serve web pages
//      - serve the page index.html
// (index.js is the server code not the page)
//      index.html is the file that we want to see when we try to connect to server

// we will use EXPRESS to host the static file
app.use(express.static('public'));

// routing function/method for the Express web framework
// sets up a route on your server based on guide found here:
//https://expressjs.com/en/guide/routing.html

// make sure that the request and incoming data is JSON
// options can be set to control what is possible in terms of receiving data.
app.use(express.json({limit: '1mb' }));

//inputs to route post method require an address where we will receive post
// and a callback function where a post can be evaluated and a response can be sent back
// ... using JS ES6 arrow syntax for the function:
app.post('/api',  (request, response) => {
    //request variable holds all of the relevent data being sent and any infromation from the client
    // response holds the information to be sent back to the client
    console.log('I got a request!');

    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // inserting the data object into a nedb database, saves to the file created
    database.insert(data);
    // sending back a response as a json object:
    // a request must be completed. 'response.end' can be the most simple form
    // though sending a response is generally better.
    response.json(data);
});


app.get('/api', (request, response) => {
    database.find({},(err, data) => {
        if (err) {
            response.end();
            console.log('there was some error retrieving database.')
            return;
        }
        response.json(data);
    });
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const weather_api_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=imperial`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();


    const data = {
        weather_forecast: weather_data,
        air_quality: aq_data
    };

    response.json(data);


})


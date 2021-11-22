let  lat, lon;

// used to save the data from the weather API
let forecast_string, temperature_string;

// used to save the data from the Air Quality API and
// used to classify the air quality reading from good to hazardous:
let aq_description, aq_value, aq_unit;

var capture;

// ORIGINAL CODE: COMMENT BACK IN IF TEST DOESN'T WORK -----------------
var capture;

function setup() {

//   let captureCanvas
  console.log('display width =', displayWidth)
  if (displayWidth <= 640) {
    var captureCanvas = createCanvas(displayWidth, displayWidth * 0.75);
    console.log('canvas width =', captureCanvas.width, 'canvas height =', captureCanvas.height);
  } else {
    var captureCanvas = createCanvas(640, 480);
    console.log('canvas width =', captureCanvas.width, 'canvas height =', captureCanvas.height);
  }

  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }    
    //video: {
      //facingMode: "user"
    //} 
  };
  capture = createCapture(constraints);
  capture.size(captureCanvas.width * 0.99, captureCanvas.height * 0.99);
  capture.position('CENTER')
//   capture.size(displayWidth,displayHeight);
  capture.position(0, 0, 'fixed');
  
  // hide the video dom element so only the canvas with video is showing
  capture.hide();
  captureCanvas.parent('captureContainer');
}



function draw() {
    image(capture, 0, 0); 
}


//--------------------------------------------------------------------------
const captureButton = document.getElementById('capturePhoto');
captureButton.addEventListener('click', async event => {

    //load the current capture to an image file and convert to base64 for sending 
    capture.loadPixels();
    const captureBase64 = capture.canvas.toDataURL();

    const data = {lat, lon, forecast_string, temperature_string, aq_description, aq_value, aq_unit, captureBase64};
 
    localStorage.setItem("calloutData", captureBase64);
    console.log('going to new window')
    window.location = "/Callout/calloutMap.html"
});
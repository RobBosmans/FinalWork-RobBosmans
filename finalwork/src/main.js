
// Array to store heart rate data
let hrData = new Array(200).fill(10);

// Variable to store the heart rate value element
let heartRateValueElement;

// Function to connect to the heart rate device via Bluetooth
async function connect(props) {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }],
      acceptAllDevices: false,
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('heart_rate');
    const char = await service.getCharacteristic('heart_rate_measurement');
    char.oncharacteristicvaluechanged = props.onChange;
    char.startNotifications();
    return char;
  } catch (error) {
    console.error(error);
  }
}

// Function to update the heart rate value
function updateHeartRate(event) {
  const heartRate = event.target.value.getInt8(1);
  const prev = hrData[hrData.length - 1];
  hrData[hrData.length] = heartRate;
  hrData = hrData.slice(-200);
  let arrow = '';
  if (heartRate !== prev) arrow = heartRate > prev ? '⬆' : '⬇';
  heartRateValueElement.textContent = heartRate;
}

// Event listener for the connect button
document.getElementById('HRMconnectButton').addEventListener('click', () => {
  heartRateValueElement = document.getElementById('heartRateValue');
  connect({ onChange: (event) => updateHeartRate(event) })
});

// JSON File uploader based on code by Github user "mwrouse", :https://gist.github.com/mwrouse/f061f6f56cbc8b0576367bddee523a79

function workoutUploader (){
  window.addEventListener('load', function() {
      let upload = document.getElementById('fileInput');
      
      // Make sure the DOM element exists
      if (upload) 
      {
        upload.addEventListener('change', function() {
          // Make sure a file was selected
          if (upload.files.length > 0) 
          {
            let reader = new FileReader(); // File reader to read the file 
            
            // This event listener will happen when the reader has read the file
            reader.addEventListener('load', function() {
              let result = JSON.parse(reader.result); // Parse the result into an object 
              let interval = result.steps
              interval.forEach(step => {
                if(step.hasOwnProperty('reps')){
                  console.log(step.reps)

                  let repeats = step.steps;

                  repeats.forEach(rep => {
                    document.getElementById('workout').insertAdjacentHTML("beforeend", `
                    <div id="workoutElement">
                    ${rep.duration/60}min
                    ${rep._hr.end}bpm
                    </div>`);
                  })

                } else {
                  document.getElementById('workout').insertAdjacentHTML("beforeend", `
                  <div id="workoutElement">
                    ${step.duration/60}min
                    ${step._hr.end}bpm
                  </div>`);
                }
                
              });
            });
            
            reader.readAsText(upload.files[0]); // Read the uploaded file
          }
        });
      }
    });
}

// time counter function based on example found here: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function timeCounter(){
  var sec = 0;

  function pad(val) {
      return val > 9 ? val : "0" + val;
  }
  var timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60 % 60, 10));
    document.getElementById("hours").innerHTML = pad(parseInt(sec / 3600 % 60, 10));
  }, 1000);
}

// function to start the application
function go (){
  document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('connectDevices').style.visibility = "hidden";
    document.getElementById('metrics').style.visibility = "visible";
    document.getElementById('workout').style.visibility = "visible";
  })
  timeCounter();
}


workoutUploader();
go();

// Array to store heart rate data for the graph
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

// Function to update the heart rate value and graph
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
      var upload = document.getElementById('fileInput');
      
      // Make sure the DOM element exists
      if (upload) 
      {
        upload.addEventListener('change', function() {
          // Make sure a file was selected
          if (upload.files.length > 0) 
          {
            var reader = new FileReader(); // File reader to read the file 
            
            // This event listener will happen when the reader has read the file
            reader.addEventListener('load', function() {
              var result = JSON.parse(reader.result); // Parse the result into an object 
              console.log(result);
              console.log(result.steps)
            });
            
            reader.readAsText(upload.files[0]); // Read the uploaded file
          }
        });
      }
    });
}

workoutUploader();
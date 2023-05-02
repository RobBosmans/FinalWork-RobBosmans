/*

Build uppon following sourcecode
Source: https://gist.github.com/sbrichardson/6e8ad851311235eee5a63c75003000d3

*/

// Array to store heart rate data for the graph
let hrData = new Array(200).fill(10);

// Variable to store the heart rate value element
let heartRateValueElement;

// Function to set up the console graph example
function setupConsoleGraphExample(height, width) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = height;
  canvas.width = width;
  context.fillStyle = '#fff';
  window.console.graph = data => {
    const n = data.length;
    const units = Math.floor(width / n);
    width = units * n;
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < n; ++i) {
      context.fillRect(i * units, 0, units, 100 - (data[i] / 2));
    }
    console.log('%c ',
      `font-size: 0; padding-left: ${width}px; padding-bottom: ${height}px;
       background: url("${canvas.toDataURL()}"), -webkit-linear-gradient(#eee, #888);`,
    );
  };
}

// Function to connect to the heart rate device via Bluetooth
async function connect(props) {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }],
      acceptAllDevices: false,
    });
    console.log(`%c\n👩🏼‍⚕️`, 'font-size: 82px;', 'Starting HR...\n\n');
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

// Function to print the heart rate value and update the graph
function printHeartRate(event) {
  const heartRate = event.target.value.getInt8(1);
  const prev = hrData[hrData.length - 1];
  hrData[hrData.length] = heartRate;
  hrData = hrData.slice(-200);
  let arrow = '';
  if (heartRate !== prev) arrow = heartRate > prev ? '⬆' : '⬇';
  console.clear();
  console.graph(hrData);
  console.log(`%c\n💚 ${heartRate} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
  heartRateValueElement.textContent = heartRate;
}

// Event listener for the connect button
document.getElementById('connectButton').addEventListener('click', () => {
  heartRateValueElement = document.getElementById('heartRateValue');
  connect({ onChange: printHeartRate });
});

// Call the setup function to initialize the console graph example
setupConsoleGraphExample(100, 400);


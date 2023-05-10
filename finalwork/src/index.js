import Chart from 'chart.js/auto';

// Array to store heart rate data for the graph
let hrData = new Array(200).fill(10);

let chart;

// Variable to store the heart rate value element
let heartRateValueElement;

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

// Function to update the heart rate value and graph
function updateHeartRate(event, chart) {
  const heartRate = event.target.value.getInt8(1);
  const prev = hrData[hrData.length - 1];
  hrData[hrData.length] = heartRate;
  hrData = hrData.slice(-200);
  let arrow = '';
  if (heartRate !== prev) arrow = heartRate > prev ? '⬆' : '⬇';
  heartRateValueElement.textContent = heartRate;
  chart.data.datasets[0].data = hrData;
  chart.update();
  console.log(`%c\n💚 ${heartRate} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n');
}

// Event listener for the connect button
document.getElementById('connectButton').addEventListener('click', () => {
  heartRateValueElement = document.getElementById('heartRateValue');
  connect({ onChange: (event) => updateHeartRate(event, chart) }).then((char) => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    document.body.appendChild(canvas);
    
    // Create line chart
    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: new Array(200).fill(0).map((_, i) => i),
        datasets: [{
          data: hrData,
          label: 'Heart Rate',
          borderColor: '#3e95cd',
          fill: false
        }]
      },
      options: {
        responsive: false,
        animation: false,
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: 200,
              suggestedMin: 0
            }
          }]
        }
      }
    });
  });
});


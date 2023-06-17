// B heartrate monitor reader based upon following example: https://gist.github.com/sbrichardson/6e8ad851311235eee5a63c75003000d3 
// Array to store heart rate data
let hrData = new Array(200).fill(10);

let totalTime = 0;

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
  localStorage.setItem(hrm, heartRateValueElement)
}

// Event listener for the connect button
document.getElementById('HRMconnectButton').addEventListener('click', () => {
  heartRateValueElement = document.getElementById('heartRateValue');
  connect({ onChange: (event) => updateHeartRate(event) })
});

//calculate percentage
let calcPercent = function(x, y) {
  return 100*x/y;
};

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
              let duration = result.duration
              totalTime = duration

              interval.forEach(step => {
                if(step.hasOwnProperty('reps')){
                  console.log(step.reps)

                  let repeats = step.steps;
                  
                  for(let i = 0; i < step.reps; i++){
                    repeats.forEach(rep => {
                      let divWidth = calcPercent(rep.duration, totalTime)+"%"; 
                      document.getElementById('workout').insertAdjacentHTML("beforeend", `
                      <div id="workoutElement" style="width:${divWidth};">
                      ${rep.duration/60}m <br>
                      ${rep._hr.end} <i id="smallIcon" class="fa-solid fa-heart"></i>
                      </div>`);
                    })
                  }
                } else {
                  let divWidth = calcPercent(step.duration, totalTime)+"%";
                  document.getElementById('workout').insertAdjacentHTML("beforeend", `
                  <div id="workoutElement" style="width:${divWidth};">
                    ${step.duration/60}m <br>
                    ${step._hr.end} <i id="smallIcon" class="fa-solid fa-heart"></i>
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

// progress bar based upon following example: https://www.geeksforgeeks.org/creating-progress-bar-using-javascript/
function workoutUpdate() {
  let progressBar = document.getElementById("workoutProgressBar");   
  let width = 1;
  let identity = setInterval(scene, 1000);
  console.log(totalTime);

  function scene() {
    if (width >= totalTime) {
      clearInterval(identity);
    } else {
      width++; 
      progressBar.style.width = calcPercent(width, totalTime)+"%";
    }
  }
}

// time counter function based on example found here: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function timeCounter(){
  let sec = 0;

  function pad(val) {
      return val > 9 ? val : "0" + val;
  }
  let timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60 % 60, 10));
    document.getElementById("hours").innerHTML = pad(parseInt(sec / 3600 % 60, 10));
  }, 1000);
}

function TouchDesignerStream(){
  let streamlink = document.getElementById('linkInput').value;
  document.getElementById('iframe').innerHTML = `
  <iframe src="${streamlink}" frameborder="0" style="background-color: #000"></iframe>
  `;
}

function userguide(){
  new Promise((resolve) => {
    document.getElementById('guideButton').addEventListener('click', resolve);
  }).then(insertUserguide);
  function insertUserguide(){
    document.getElementById('mainMenu').insertAdjacentHTML("beforeend",  `
    <div id="userguide">
    <h2>Userguide</h2>
    <ol>
      <li>Download the <a href="/TouchDesigner/websockets-FinalWork.17.toe">TouchDesigner file</a></li>
      <li>Open the TouchDesigner file and press F1</li>
      <li>Connect your heartratemonitor</li>
      <li>Go to <a target=”_blank” href="https://vdo.ninja/v16/">vdo.ninja</a> and remote screenshare</li>
      <li>Choose TouchDesigner window and enter link</li>
    </ol>
    <h3>Optional</h3>
    <ol>
      <li>Make a workout on <a target=”_blank” href="https://intervals.icu/"> intervals.icu</a></li>
      <li>Export it as a JSON file</li>
      <li>Upload the JSON file</li>
      <p><a href="/Workout/workouts.zip">Workout examples</a></p>
    </ol>
    <h2>Troubleshooting</h2>
    <ul>
      <li>If the visuals aren't being influenced turn the button in the TouchDesigner window off and on again</li>
    </ul>
  </div>
    `)
  }
}

// function to start the application
function go (){
  document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('mainMenu').style.visibility = "hidden";
    document.getElementById('metrics').style.visibility = "visible";
    document.getElementById('workout').style.visibility = "visible";
    document.getElementById('workoutProgressBar').style.visibility = "visible";
    TouchDesignerStream();
    timeCounter();
    workoutUpdate();
  })
}

userguide();
workoutUploader();
go();
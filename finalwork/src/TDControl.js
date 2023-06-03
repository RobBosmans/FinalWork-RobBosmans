let ws = new WebSocket("wss://socket-server-finalwork.onrender.com:443");

//
document.getElementById('Start').addEventListener('click', () => {
  function sendHrmData(){
    let hrmValue = document.getElementById('heartRateValue').innerHTML
    console.log(hrmValue);
    ws.send(JSON.stringify({slider1: hrmValue/2}))
  }
  setInterval(sendHrmData, 1000);
})

/* let controlTD = document.querySelector(".controllTD");
controlTD.addEventListener("input", (event) => {
  console.log(controlTD.value);
  ws.send(JSON.stringify({ slider1: controlTD.value / 100.0 }));
}); */

ws.addEventListener("open", (event) => {
  console.log("websocket opened");
});

ws.addEventListener("message", (message) => {
  console.log(message);
});

ws.addEventListener("error", (error) => {
  console.error("websocket closed");
});

ws.addEventListener("close", (event) => {
  console.log("websocket closed");
});

// TouchDesigner WebSocket based upon following example: https://www.youtube.com/watch?v=P-N8-sJEM6s&list=PLgfxkm9xFocaQvweC3KF3uIeQyDhsLhWX

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

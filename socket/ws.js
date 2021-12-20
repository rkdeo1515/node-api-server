var express = require('express');
var app = express();
var expressWs = require('express-ws')(app)

var AppClient = require('../socket/client')
var client = new AppClient()

app.ws("/ws", function (ws, req) {

    setInterval(() => { console.log(client.sensordata); ws.send(JSON.stringify(client.sensordata)); }, 2000);
        
    ws.on("close", () => {
        console.log("test websocket");
        
    });
});
module.exports = app;
// function WS() {
//     app.ws("/ws", function (ws, req) {
//         setInterval(() => { ws.send(JSON.stringify(client.sensordata)); }, 2000);
        
//         ws.on("close", () => {
//             console.log("test websocket");
        
//         });
//     });

// }
// module.exports = WS;
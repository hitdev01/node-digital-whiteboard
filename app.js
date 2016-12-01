var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var connects = [];
var data = {};

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server})
console.log("websocket server created");

wss.on('connection', function(ws) {
  console.log('websocket connection open');
  // 接続してきたソケットを格納
  connects.push(ws);
  console.log('connected sockets: ' + connects.length);

  ws.on('message', function(message) {
    console.log('[get message]'+ message);
    broadcast(message);
  })

  ws.on('close', function() {
    console.log('websocket connection close');
    // 接続切れのソケットを配列から除外
    connects = connects.filter(function (conn, i) {
        return (conn === ws) ? false : true;
    });
    console.log('connected sockets: ' + connects.length);
    // clearInterval(id);
  })
})

function broadcast (message) {
    connects.forEach(function (socket, i) {
        socket.send(message);
    });
}

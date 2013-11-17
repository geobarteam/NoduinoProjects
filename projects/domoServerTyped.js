var requirejs = require('requirejs');
var http = require("http");
var socketio = require("socket.io");
var static = require('node-static');
var assert = require("assert");
var DomoServer = (function () {
    function DomoServer(noduino, file) {
        this.noduino = noduino;
        this.file = file;
    }
    DomoServer.prototype.handler = function (req, resp, file) {
        req.addListener('end', function () {
            file.serve(req, resp);
        }).resume();
    };
    return DomoServer;
})();
requirejs.config({
    nodeRequire: require
});
requirejs([
    '../public/scripts/libs/Noduino', 
    '../public/scripts/libs/Noduino.Serial', 
    '../public/scripts/libs/Logger'
], function (NoduinoObj, NoduinoConnector, Logger) {
    var server = new DomoServer(new NoduinoObj({
        'debug': false
    }, NoduinoConnector, Logger), new static.Server('./domotique/public'));
    var app = http.createServer(server.handler);
    var io = socketio.listen(app);
    io.sockets.on('connection', function (socket) {
        server.noduino.connect(function (err, board) {
            var arduino = require('duino');
            if(err) {
                return console.log(err);
            }
            board.withAnalogInput({
                pin: 'A2'
            }, function (err, AnalogInput) {
                AnalogInput.on('change', function (a) {
                    socket.emit('lightintensity', a.value);
                });
            });
        });
    });
    app.listen(8080);
    console.log('Server running at http://127.0.0.1:8080/');
});
//@ sourceMappingURL=domoServerTyped.js.map

var requirejs = require('requirejs');
var http = require("http");
var socketio = require("socket.io");
var static = require('node-static')
var assert = require("assert");

var DomoServer = (function () {
    function DomoServer(noduino) {
        this.noduino = noduino;
        this.fileServer = new static.Server('./domotique/public');
    }

    DomoServer.prototype.listen = function(){
        var self = this;
        var handler = function (req, resp) {
            req.addListener('end', function () {
                self.fileServer.serve(req, resp);
            }).resume();
        };
        var app = http.createServer(handler);
        var io = socketio.listen(app);
        io.sockets.on('connection', function (socket) {
            self.noduino.connect(function (err, board) {
                var arduino = require('duino');
                if(err) { return console.log(err); }
                board.withAnalogInput({pin: 'A2'}, function (err, AnalogInput) {
                    AnalogInput.on('change', function (a) {
                        socket.emit('lightintensity', a.value);
                    });
                });
            });
        });
        app.listen(8080);
        console.log('Server running at http://127.0.0.1:8080/');
    };

    return DomoServer;
})();
requirejs.config({
    nodeRequire: require
});

requirejs.config({nodeRequire: require});
requirejs(['../public/scripts/libs/Noduino', '../public/scripts/libs/Noduino.Serial', '../public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {

    var server = new DomoServer(new NoduinoObj({'debug': false}, NoduinoConnector, Logger), new static.Server('./domotique/public'));
    server.listen();
});
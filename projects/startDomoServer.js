var requirejs = require('requirejs');
var socketio = require("socket.io");
var assert = require("assert");
var Domo = require("../projects/domotique/lib/DomoServer.js");
var http = require("http");
var static = require('node-static');

requirejs.config({
    nodeRequire: require
});

requirejs.config({nodeRequire: require});
requirejs(['../public/scripts/libs/Noduino', '../public/scripts/libs/Noduino.Serial', '../public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {


    var fileServer = new Domo.FileServer(http, static, "./domotique/public");
    var server = new Domo.DomoServer(new NoduinoObj({'debug': false}, NoduinoConnector, Logger), fileServer, socketio);

    server.onConnect(function (err, board) {
        if(err) { return console.log(err); }
        board.withAnalogInput({pin: 'A2'}, function (err, AnalogInput) {
            AnalogInput.on('change', function (a) {
                server.socket.emit('lightintensity', a.value);
            });
        });
    });
    server.listen();

});
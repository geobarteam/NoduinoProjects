/**
 * Created by Geoffrey on 19/11/13.
 */

var Domo = require("../lib/DomoServer");

exports.testSomething = function(test){


    var noduino = (function (){
        function noduino()
        {

        }
        return noduino;
    })();

    var static = {
        Server : function(){}
    };

    var http ={
        createServer: function(){
            return {
                listen : function(){}
            }
        }
    };

    var sockets = {
        on : function(){}
    };

    var socketio = { listen:function() {
        return { sockets: function() {
            return sockets;
            }()
        }
    }};

    var fileServer = new Domo.FileServer(http, static, "");
    var domoServer = new Domo.DomoServer(new noduino(), fileServer, socketio);
    domoServer.listen();
    test.ok(domoServer!=undefined, "this assertion should pass");

    test.done();
}


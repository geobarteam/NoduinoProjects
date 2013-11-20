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

    var fileServer = (function(){
        function fileServer(){

        }
        return fileServer;
    })();

    var domoServer = new Domo.DomoServer(new noduino(), new fileServer());
    domoServer.listen();
    test.ok(domoServer!=undefined, "this assertion should pass");

    test.done();
}


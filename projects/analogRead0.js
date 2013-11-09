var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['../public/scripts/libs/Noduino', '../public/scripts/libs/Noduino.Serial', '../public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {
  var http = require('http');
  http.createServer(function(req, rs){
      console.log('Server running at http://127.0.0.1:1337/');
	  var Noduino = new NoduinoObj({'debug': false}, NoduinoConnector, Logger);
	  
	  var led;
	  Noduino.connect(function(err, board) {
	  	var arduino = require('duino');
	    if (err) { return console.log(err); }
	    board.withLED({pin: 13}, function(err,LED){
	    	led = LED;
	    });
		
	    board.withAnalogInput({pin:  'A2'}, function(err, AnalogInput) { 
	      AnalogInput.on('change', function(a) { 
	        console.log('read value: ' + a.value);
	        if (led && a.value <=300)
	        {
	        	console.log("on")
	        	led.setOn();
	        	
	        }
	        else if(led)
	        {
	        	console.log("off");
	        	led.setOff();
	        }
	        	
	      });
	    });
	  });
  }).listen(1337, '127.0.0.1');
})
var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['../public/scripts/libs/Noduino', '../public/scripts/libs/Noduino.Serial', '../public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {
  
  var state = false;
  self = this;
  var http = require('http');
  http.createServer(function(req, res){
      console.log('Server running at http://127.0.0.1:1337/');
      res.writeHead(200, {'Content-Type':'text/plain'});
      self.state = (req.url ==='/on')
	  res.end("State of led is:" + state);
  }).listen(1337, '127.0.0.1');
  
  var led;
  var Noduino = new NoduinoObj({'debug': false}, NoduinoConnector, Logger);
  self = this;
  Noduino.connect(function(err, board) {
  	var arduino = require('duino');
    if (err) { return console.log(err); }
    board.withLED({pin: 13}, function(err,LED){
    	led = LED;
    });
	
    board.withAnalogInput({pin:  'A2'}, function(err, AnalogInput) { 
      AnalogInput.on('change', function(a) { 
        console.log('read value: ' + a.value);
        if (led && a.value <=200 && self.state)
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
  

})
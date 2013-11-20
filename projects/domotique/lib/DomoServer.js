
exports.DomoServer = (function () {
    function DomoServer(noduino, fileServer, socketio) {
        this.noduino = noduino;
        this.fileServer = fileServer;
        this.socketio = socketio;
    }

    DomoServer.prototype.onConnect = function(connectHandler){
        this.connect = connectHandler;
    }

    DomoServer.prototype.listen = function(){
        var app = this.fileServer.start();
        var io = this.socketio.listen(app);
        var self = this;
        io.sockets.on('connection', function (socket) {
            self.socket = socket;
            self.noduino.connect(self.connect);
        });

        app.listen(8080);
        console.log('Server running at http://127.0.0.1:8080/');
    };


    return DomoServer;
})();

exports.FileServer = (function(){
    function FileServer(http, static, path){
        this.http = http;
        this.staticServer = new static.Server(path);
    }

    FileServer.prototype.start = function() {
        var self = this;
        var handler = function (req, resp) {
            req.addListener('end', function () {
                self.staticServer.serve(req, resp);
            }).resume();
        };
        return this.http.createServer(handler);
    };

    return FileServer;
})();



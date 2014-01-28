var http = require('http');
var serialize = require('./lib/index').serialize;
var editorial = require('./editorial');
var BufferedStream = function(wrapped_stream, buffer_threshold) {
    this.buffer_size = 0;
    this.buffer_threshold = buffer_threshold || 1024;
    this.buffer = [];
    this.wrapped_stream = wrapped_stream;
};

BufferedStream.prototype.write = function(chunk) {
    this.buffer.push(chunk);
    this.buffer_size += chunk.length;
    if (this.buffer_size >= this.buffer_threshold) {
        this.wrapped_stream.write(this.buffer.join(""));
        this.buffer_size = 0;
        this.buffer = [];
    }
}

BufferedStream.prototype.end = function() {
    if (this.buffer_size > 0) {
        this.wrapped_stream.write(this.buffer.join(""));
        this.buffer_size = 0;
        this.buffer = [];   
    }
}
http.createServer(function respond (req, res) {
  res.writeHead(200, {'Content-Type':'application/json'});
  var stream = new BufferedStream(res, 10240);
  serialize(editorial, stream);
  res.end();
}).listen(8999);


http.createServer(function respond (req, res) {
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify(editorial));
}).listen(8998);

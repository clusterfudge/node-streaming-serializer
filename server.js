var http = require('http');
var serialize = require('./lib/index').serialize;
var editorial = require('./editorial');
http.createServer(function respond (req, res) {
  res.writeHead(200, {'Content-Type':'application/json'});
  serialize(editorial, res);
  res.end();
}).listen(8999);

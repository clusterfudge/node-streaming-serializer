var serialize = require('./lib/index.js').serialize;

var x = {
  'x':10,
  'y':20,
  'z':{'foo':'bar'}
}

var data = require('./editorial');
x = data;
console.log(JSON.stringify(x));
serialize(x,process.stdout);
console.log('');

var StringStream = function() {
    this.buffer = [];
};
StringStream.prototype.write = function(chunk) {
    this.buffer.push(chunk);
}

StringStream.prototype.toString = function() {
    return this.buffer.join("");
}

var stream = new StringStream();
serialize(x, stream);
var str = JSON.stringify(x);
console.log(str === stream.toString());

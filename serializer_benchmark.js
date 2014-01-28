var data = require('./editorial');
var serialize = require('./lib/index').serialize;
var recursiveSerialize = require('./lib/index').recursiveSerialize;
var serializer_start = new Date().getTime();

var StringStream = function() {
    this.buffer = [];
};
StringStream.prototype.write = function(chunk) {
    this.buffer.push(chunk);
}

StringStream.prototype.toString = function() {
    return this.buffer.join("");
}

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

var stream = new BufferedStream(process.stdout, 10240);

for (var i = 0; i < 10000; i++) {
    serialize(data, stream);
}
process.stderr.write('Serialized 10k payloads to stdout in ' + (new Date().getTime() - serializer_start) + '\n');

serializer_start = new Date().getTime();
for (var i = 0; i < 10000; i++) {
    recursiveSerialize(data, stream);
    stream.end();
}
process.stderr.write('Recursively serialized 10k payloads to stdout in ' + (new Date().getTime() - serializer_start) + '\n');

serializer_start = new Date().getTime();
for (var i = 0; i < 10000; i++) {
    process.stdout.write(JSON.stringify(data));
}
process.stderr.write('Stringified 10k payloads to stdout in ' + (new Date().getTime() - serializer_start) + '\n');

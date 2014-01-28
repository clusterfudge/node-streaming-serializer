function recursiveSerialize(data, stream, encode_root_string) {
    if (data instanceof Array) {
        stream.write('[');
        var i = 0;
        for (i = 0; i < data.length - 1; i++) {
            serialize(data[i], stream, true);
            stream.write(',');
        }
        if ( i < data.length) {
            serialize(data[i], stream, true);
        }
        stream.write(']');
    } else if (data instanceof Number || typeof(data) == 'number') {
        stream.write(data.toString());
    } else if (typeof(data) === 'string' || data instanceof String) {
        if (encode_root_string) {
            stream.write(JSON.stringify(data));
        } else {
            stream.write(data);
        }
    } else if (typeof(data) === 'undefined') {
        stream.write('undefined');
    } else if (data === null) {
        stream.write('null');
    } else if (data instanceof Object) {
        stream.write('{');
        var keys = Object.keys(data);
        var i = 0;
        for (i = 0; i < keys.length - 1; i++) {
            stream.write('"' + keys[i] + '":');
            serialize(data[keys[i]], stream, true);
            stream.write(',');
        }
        if (i < keys.length) {
            stream.write('"' + keys[i] + '":');
            serialize(data[keys[i]], stream, true);
        }
        stream.write('}');
    } else {
        stream.write(data.toString());
    }
}

function isString(data) {
    return typeof(data) === 'string' 
            || data instanceof String;
}

function isPrimitive(data) {
    return data instanceof Number 
            || typeof(data) == 'number' 
            || !data 
            || typeof(data) === 'boolean';
}

function createElementsList(obj) {
    if (obj instanceof Array) {
        return obj;
    } else {
        return Object.keys(obj);
    }
}


function getObjectOpener(obj) {
    if (obj instanceof Array) {
        return '[';
    } else {
        return '{';
    }
}

function getObjectCloser(obj) {
    if (obj instanceof Array) {
        return ']';
    } else {
        return '}';
    }
}

function serialize(data, stream, encode_root_string) {
    if (isPrimitive(data)) {
        stream.write(JSON.stringify(data));
        return;
    } else if (isString(data)) {
        if (encode_root_string) {
            stream.write(JSON.stringify(data));
        } else {
            stream.write(data);
        }
        return;
    }
    var stack = [[data, createElementsList(data), 0]];
    callStackLoop: while (stack.length > 0) {
        var cur = stack.pop();
        var obj = cur[0];
        var values = cur[1];
        var index = cur[2];
        //when in this loop, we know that we are iterating through either an array or a dictionary
        if (index === 0) {
            stream.write(getObjectOpener(obj));
        } else if (index < values.length) {
            stream.write(',');
        }
        while (index < values.length - 1) {
            if (obj instanceof Array) {
                if (!isPrimitive(values[index]) && !isString(values[index])) {
                    stack.push([obj, values, index + 1]);
                    stack.push([values[index], createElementsList(values[index]), 0]);
                    continue callStackLoop;
                } else {
                    stream.write(JSON.stringify(values[index]));
                    stream.write(',');
                }
            } else {
                stream.write('"');
                stream.write(values[index]);
                stream.write('":');
                    
                if (!isPrimitive(obj[values[index]]) && !isString(obj[values[index]])) {
                    stack.push([obj, values, index + 1]);
                    stack.push([obj[values[index]], createElementsList(obj[values[index]]), 0]);
                    continue callStackLoop;
                } else {
                    stream.write(JSON.stringify(obj[values[index]]));
                    stream.write(',');
                }
            }
            index += 1;
        }
        if (index < values.length) {
            if (obj instanceof Array) {
                if (!isPrimitive(values[index]) && !isString(values[index])) {
                    stack.push([obj, values, index + 1]);
                    stack.push([values[index], createElementsList(values[index]), 0]);
                    continue callStackLoop;
                } else {
                    stream.write(JSON.stringify(values[index]));
                }
            } else {
                stream.write('"');
                stream.write(values[index]);
                stream.write('":');
                    
                if (!isPrimitive(obj[values[index]]) && !isString(obj[values[index]])) {
                    stack.push([obj, values, index + 1]);
                    stack.push([obj[values[index]], createElementsList(obj[values[index]]), 0]);
                    continue callStackLoop;
                } else {
                    stream.write(JSON.stringify(obj[values[index]]));
                }
            }
        }
        stream.write(getObjectCloser(obj));
    }
    if (stream.end) {
        stream.end();
    }
}

exports.recursiveSerialize = recursiveSerialize;
exports.serialize = serialize;
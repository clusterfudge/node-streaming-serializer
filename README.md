node-streaming-serializer
=========================

A streaming object serializer for nodejs, similar to the concepts behind Codehaus Jackson object mapper streaming serializer. 

This is a pure NodeJS proof-of-concept, and would need a C implementation to actually compete with JSON.stringify in v8. At this time it has no benefits (with the exception of space consumption) over writing a response directly.

Current stats with stdout being piped to /dev/null and a 10k internal write buffer (all times in ms):

    $ node serializer_benchmark.js > /dev/null
    Serialized 10k payloads to stdout in 6740
    Recursively serialized 10k payloads to stdout in 6785
    Stringified 10k payloads to stdout in 1635

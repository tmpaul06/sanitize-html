var assert = require('assert');
var sanitize = require('../index');
var stream = require('stream');
var fs = require('fs');

describe('Streaming test', function() {
  it("should accept a readable stream as input", function () {
    assert.doesNotThrow(function() {
      sanitize(null, {
        stream: {
          input: new stream.Readable()
        }
      });  
    });
    assert.throws(function() {
      sanitize(null, {
        stream: {
          input: "<html></html>"
        }
      });  
    });
  });

  it("should accept a writeable stream as output", function () {
    assert.doesNotThrow(function() {
      sanitize(null, {
        stream: {
          input: new stream.Readable(),
          output: new stream.Writable()
        }
      });  
    });
    assert.throws(function() {
      sanitize(null, {
        stream: {
          input: new stream.Readable(),
          output: 'fs'
        }
      });  
    });
  });

  it("should accept an output stream for writing", function (done) {
    var rStream = new stream.Readable();
    rStream._read = function(){}; 
    var wStream = new stream.Writable();
    var original = '<html><body><a><img /></a></body></html>'
    var sanitized = '';
    wStream._write = function(chunk, encoding, next) {
      sanitized += chunk.toString();
      next();
    };
    wStream.on('finish', function() {
      assert.equal(sanitized, original);
      done();
    });
    sanitize(null, {
      allowedTags: false,
      stream: {
        input: rStream,
        output: wStream
      }
    });
    rStream.push(original);
    rStream.push(null);
  });

  it("should call a callback with full string if provided", function (done) {
    var rStream = new stream.Readable();
    rStream._read = function(){}; 
    var original = '<html><body><a><img /></a></body></html>';
    sanitize(null, {
      allowedTags: false,
      stream: {
        input: rStream,
        callback:  function(data) {
          assert(data, original);
          done();
        }
      }
    });
    rStream.push(original);
    rStream.push(null);
  });
});

function Result(onFlush) {
  this.chunkStr = '';
  this.onFlush = onFlush;
  this.offset = 0;
}

Result.prototype = {
  get length() {
    return this.chunkStr.length;
  }
};

Result.prototype.toString = function() {
  return this.chunkStr;
};

Result.prototype.add = function(chunk) {
  this.chunkStr += chunk;
  return this;
};

Result.prototype.remove = function(startIndex, endIndex) {
  this.chunkStr = this.chunkStr.substr(startIndex, endIndex);
  return this;
};

Result.prototype.flush = function() {
  if (this.onFlush && typeof this.onFlush === 'function') {
    this.onFlush(this.chunkStr.substr(this.offset, this.chunkStr.length));
  }
  this.offset = this.chunkStr.length;
};

module.exports = Result;

var util = require('util')
var Transform = require('stream').Transform
var imageSize = require('image-size');
var DEFAULT_LIMIT = 128 * 1024;

util.inherits(ImageSize, Transform)

module.exports = ImageSize

function ImageSize(options) {
  if (!(this instanceof ImageSize))
    return new ImageSize(options);
  Transform.call(this, options)
  this.dimensions = null;
  this.buffer=new Buffer(0);
  this.len=0;
}

ImageSize.prototype._transform = function (chunk, encoding, callback) {

  if(!this.dimensions){
    this.len += chunk.length;
    this.buffer = Buffer.concat([ this.buffer, chunk],  this.len);
    try{
      this.dimensions = imageSize(this.buffer);
      this.emit('dimensions',this.dimensions);
    }catch(e){
      this.emit('error',e);
    }
  }
  this.push(chunk);
  callback()


}


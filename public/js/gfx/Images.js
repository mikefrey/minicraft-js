
function Img(path, fn) {
  this.path = path;
  this.fn = fn;

  this._img = new Image();
  this._img.onload = this.onload.bind(this);
  this._img.onerror = this.onerror.bind(this);
  this._img.src = path;
}

Img.prototype = {

  getData: function(x, y, h, w) {
    return this.ctx.getImageData(x, y, h, w);
  },

  onload: function() {
    this.width = this._img.width;
    this.height = this._img.height;

    var canvas = document.createElement('canvas');
    canvas.height = this.height;
    canvas.width = this.width;
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    ctx.drawImage(this._img, 0, 0);
    this.ctx = ctx;

    this.fn();
  },

  onerror: function() {
    console.log("IMAGE LOAD ERROR:", arguments);
  }

};





function Images() {

}

Images.prototype = {

  add: function(name, path, fn) {
    this[name] = new Img(path, fn);
  }

};

var images = new Images();
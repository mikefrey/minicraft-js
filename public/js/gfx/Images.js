
// function Img(path, fn) {
//   this.path = path;
//   this.fn = fn;

//   this._img = new Image();
//   this._img.onload = this.onload.bind(this);
//   this._img.onerror = this.onerror.bind(this);
//   this._img.src = path;
// }

// Img.prototype = {

//   getData: function(x, y, w, h) {
//     return this.ctx.getImageData(x, y, w, h);
//   },

//   onload: function() {
//     var canvas = document.createElement('canvas');
//     canvas.height = this.height * 2;
//     canvas.width = this.width * 2;
//     document.body.appendChild(canvas);

//     var ctx = canvas.getContext('2d');
//     ctx.drawImage(this._img, 0, 0);
//     ctx.scale(-1, 1);
//     ctx.drawImage(this._img, this.width, 0);
//     ctx.scale(1, -1);
//     ctx.drawImage(this._img, 0, this.height);
//     ctx.scale(-1, -1);
//     ctx.drawImage(this._img, this.width, this.height);
//     ctx.scale(1, 1);

//     this.fn();
//   },

//   onerror: function() {
//     console.log("IMAGE LOAD ERROR:", arguments);
//   }

// };





function Images() { }

Images.prototype = {

  add: function(name, path, fn) {
    //this[name] = new Img(path, fn);

    function onload(ev) {
      // this.width = this._img.width;
      // this.height = this._img.height;

      canvas.height = img.height * 2;
      canvas.width = img.width * 2;
      document.body.appendChild(canvas);

      var ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(img, -img.width*2, 0);
      ctx.restore();

      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, -img.height*2);
      ctx.restore();

      ctx.save();
      ctx.scale(-1, -1);
      ctx.drawImage(img, -img.width*2, -img.height*2);
      ctx.restore()

      fn();
    }

    var img = new Image();
    img.onload = onload;
    img.onerror = this.onerror.bind(this);
    img.src = path;


    var canvas = document.createElement('canvas');
    canvas.style.display = 'none';

    this[name] = canvas;
  },

  onerror: function() {
    console.log("IMAGE LOAD ERROR:", arguments);
  }

};

var images = new Images();
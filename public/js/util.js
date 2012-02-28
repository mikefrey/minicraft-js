function extend(obj) {
  var args = Array.prototype.slice.call(arguments, 1),
      source, prop, i;
  for (i = 0; i < args.length; i++) {
    source = args[i];
    for (prop in source) {
      if (source[prop] !== void 0) obj[prop] = source[prop];
    }
  }
  return obj;
}

Array.prototype.remove = function(item) {
  var idx = this.indexOf(item);
  if (idx) return (this.splice(idx, 1))[0];
  return null;
};

Array.prototype.removeAll = function(arr) {
  //for (var i = this.length - 1; i >= 0; i--) {
  for (var j = 0; j < arr.length; j++) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i].uid === arr[j].uid) {
        this.splice(i, 1);
        break;
      }
    }
  }
};




function Random() {
  this.haveNextNextGaussian = false;
}
Random.prototype = {

  nextInt: function(n) {
    return (Math.random() * n)|0;
  },

  nextBoolean: function() {
    return !!((Math.random() * 2)|0);
  },

  nextFloat: function() {
    return Math.random();
  },

  nextGaussian: function() {
    if (this.haveNextNextGaussian) {
      this.haveNextNextGaussian = false;
      return this.nextNextGaussian;
    } else {
      var v1, v2, s;
      do {
        v1 = 2 * Math.random() - 1;   // between -1.0 and 1.0
        v2 = 2 * Math.random() - 1;   // between -1.0 and 1.0
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s == 0);
      var multiplier = Math.sqrt(-2 * Math.log(s)/s);
      this.nextNextGaussian = v2 * multiplier;
      this.haveNextNextGaussian = true;
      return v1 * multiplier;
    }
  }
};

var random = new Random();




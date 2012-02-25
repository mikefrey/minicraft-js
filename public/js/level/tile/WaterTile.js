
function WaterTile(id) {
  WaterTile.Super.init.call(this, id);
  this.connectsToSand = true;
  this.connectsToWater = true;
}

WaterTile.Super = Tile.prototype;
WaterTile.prototype = extend(new Tile(), {

  render: function(screen, level, x, y) {
    //wRandom.setSeed((tickCount + (x / 2 - y) * 4311) / 10 * 54687121l + x * 3271612l + y * 3412987161l);
    var col = Color.get(5, 5, 115, 115);
    var transitionColor1 = Color.get(3, 5, level.dirtColor - 111, level.dirtColor);
    var transitionColor2 = Color.get(3, 5, level.sandColor - 110, level.sandColor);

    var u = !level.getTile(x, y - 1).connectsToWater;
    var d = !level.getTile(x, y + 1).connectsToWater;
    var l = !level.getTile(x - 1, y).connectsToWater;
    var r = !level.getTile(x + 1, y).connectsToWater;

    var su = u && level.getTile(x, y - 1).connectsToSand;
    var sd = d && level.getTile(x, y + 1).connectsToSand;
    var sl = l && level.getTile(x - 1, y).connectsToSand;
    var sr = r && level.getTile(x + 1, y).connectsToSand;

    if (!u && !l) {
      screen.render(x * 16 + 0, y * 16 + 0, random.nextInt(4), col, random.nextInt(4));
    } else
      screen.render(x * 16 + 0, y * 16 + 0, (l ? 14 : 15) + (u ? 0 : 1) * 32, (su || sl) ? transitionColor2 : transitionColor1, 0);

    if (!u && !r) {
      screen.render(x * 16 + 8, y * 16 + 0, random.nextInt(4), col, random.nextInt(4));
    } else
      screen.render(x * 16 + 8, y * 16 + 0, (r ? 16 : 15) + (u ? 0 : 1) * 32, (su || sr) ? transitionColor2 : transitionColor1, 0);

    if (!d && !l) {
      screen.render(x * 16 + 0, y * 16 + 8, random.nextInt(4), col, random.nextInt(4));
    } else
      screen.render(x * 16 + 0, y * 16 + 8, (l ? 14 : 15) + (d ? 2 : 1) * 32, (sd || sl) ? transitionColor2 : transitionColor1, 0);
    if (!d && !r) {
      screen.render(x * 16 + 8, y * 16 + 8, random.nextInt(4), col, random.nextInt(4));
    } else
      screen.render(x * 16 + 8, y * 16 + 8, (r ? 16 : 15) + (d ? 2 : 1) * 32, (sd || sr) ? transitionColor2 : transitionColor1, 0);
  },

  mayPass: function(level, x, y, e) {
    return e.canSwim();
  },

  tick: function(level, xt, yt) {
    var xn = xt;
    var yn = yt;

    if (random.nextBoolean())
      xn += random.nextInt(2) * 2 - 1;
    else
      yn += random.nextInt(2) * 2 - 1;

    if (level.getTile(xn, yn) == Tile.hole) {
      level.setTile(xn, yn, this, 0);
    }
  }



});

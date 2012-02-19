

function StoneTile(id) {
  StoneTile.Super.init.call(this, id);
}

StoneTile.Super = Tile.prototype;
StoneTile.prototype = extend({}, new Tile(), {

  render: function(screen, level, x, y) {
    var rc1 = 111;
    var rc2 = 333;
    var rc3 = 555;
    screen.render(x * 16 + 0, y * 16 + 0, 32, Color.get(rc1, level.dirtColor, rc2, rc3), 0);
    screen.render(x * 16 + 8, y * 16 + 0, 32, Color.get(rc1, level.dirtColor, rc2, rc3), 0);
    screen.render(x * 16 + 0, y * 16 + 8, 32, Color.get(rc1, level.dirtColor, rc2, rc3), 0);
    screen.render(x * 16 + 8, y * 16 + 8, 32, Color.get(rc1, level.dirtColor, rc2, rc3), 0);
  },

  mayPass: function(level, x, y, e) {
    return false;
  }

});

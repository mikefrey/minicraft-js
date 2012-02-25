

function StairsTile(id, leadsUp) {
  StairsTile.Super.init.call(this, id);
  this.leadsUp = leadsUp;
}

StairsTile.Super = Tile.prototype;
StairsTile.prototype = extend(new Tile(), {

  render: function(screen, level, x, y) {
    var color = Color.get(level.dirtColor, 0, 333, 444);
    var xt = 0;
    if (this.leadsUp) xt = 2;
    screen.render(x * 16 + 0, y * 16 + 0, xt + 2 * 32, color, 0);
    screen.render(x * 16 + 8, y * 16 + 0, xt + 1 + 2 * 32, color, 0);
    screen.render(x * 16 + 0, y * 16 + 8, xt + 3 * 32, color, 0);
    screen.render(x * 16 + 8, y * 16 + 8, xt + 1 + 3 * 32, color, 0);
  }

});

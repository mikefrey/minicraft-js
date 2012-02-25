

function SaplingTile(id, onType, growsTo) {
  SaplingTile.Super.init.call(this, id);
  this.onType = onType;
  this.growsTo = growsTo;
  this.connectsToSand = onType.connectsToSand;
  this.connectsToGrass = onType.connectsToGrass;
  this.connectsToWater = onType.connectsToWater;
  this.connectsToLava = onType.connectsToLava;
}

SaplingTile.Super = Tile.prototype;
SaplingTile.prototype = extend(new Tile(), {

  render: function(screen, level, x, y) {
    onType.render(screen, level, x, y);
    var col = Color.get(10, 40, 50, -1);
    screen.render(x * 16 + 4, y * 16 + 4, 11 + 3 * 32, col, 0);
  },

  tick: function(level, x, y) {
    var age = level.getData(x, y) + 1;
    if (age > 100) {
      level.setTile(x, y, growsTo, 0);
    } else {
      level.setData(x, y, age);
    }
  },

  hurt: function(level, x, y, source, dmg, attackDir) {
    level.setTile(x, y, onType, 0);
  }

});
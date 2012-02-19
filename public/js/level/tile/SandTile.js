
function SandTile(id) {
  SandTile.Super.init.call(this, id);
  this.connectsToSand = true;
}

SandTile.Super = Tile.prototype;
SandTile.prototype = extend({}, new Tile(), {

  render: function(screen, level, x, y) {
    var col = Color.get(level.sandColor + 2, level.sandColor, level.sandColor - 110, level.sandColor - 110);
    var transitionColor = Color.get(level.sandColor - 110, level.sandColor, level.sandColor - 110, level.dirtColor);

    var u = !level.getTile(x, y - 1).connectsToSand;
    var d = !level.getTile(x, y + 1).connectsToSand;
    var l = !level.getTile(x - 1, y).connectsToSand;
    var r = !level.getTile(x + 1, y).connectsToSand;

    var steppedOn = level.getData(x, y) > 0;

    if (!u && !l) {
      if (!steppedOn)
        screen.render(x * 16 + 0, y * 16 + 0, 0, col, 0);
      else
        screen.render(x * 16 + 0, y * 16 + 0, 3 + 1 * 32, col, 0);
    } else
      screen.render(x * 16 + 0, y * 16 + 0, (l ? 11 : 12) + (u ? 0 : 1) * 32, transitionColor, 0);

    if (!u && !r) {
      screen.render(x * 16 + 8, y * 16 + 0, 1, col, 0);
    } else
      screen.render(x * 16 + 8, y * 16 + 0, (r ? 13 : 12) + (u ? 0 : 1) * 32, transitionColor, 0);

    if (!d && !l) {
      screen.render(x * 16 + 0, y * 16 + 8, 2, col, 0);
    } else
      screen.render(x * 16 + 0, y * 16 + 8, (l ? 11 : 12) + (d ? 2 : 1) * 32, transitionColor, 0);
    if (!d && !r) {
      if (!steppedOn)
        screen.render(x * 16 + 8, y * 16 + 8, 3, col, 0);
      else
        screen.render(x * 16 + 8, y * 16 + 8, 3 + 1 * 32, col, 0);

    } else
      screen.render(x * 16 + 8, y * 16 + 8, (r ? 13 : 12) + (d ? 2 : 1) * 32, transitionColor, 0);
  },

  tick: function(level, x, y) {
    var d = level.getData(x, y);
    if (d > 0) level.setData(x, y, d - 1);
  },

  steppedOn: function(level, x, y, e) {
    if (e instanceof Mob) {
      level.setData(x, y, 10);
    }
  },

  interact: function(level, xt, yt, player, item, attackDir) {
    if (item instanceof ToolItem) {
      var tool = item;
      if (tool.type == ToolType.shovel) {
        if (player.payStamina(4 - tool.level)) {
          level.setTile(xt, yt, Tile.dirt, 0);
          level.add(new ItemEntity(new ResourceItem(Resource.sand), xt * 16 + random.nextInt(10) + 3, yt * 16 + random.nextInt(10) + 3));
          return true;
        }
      }
    }
    return false;
  }

});

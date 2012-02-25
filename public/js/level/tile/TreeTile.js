

function TreeTile(id) {
  TreeTile.Super.init.call(this, id);
  this.connectsToGrass = true;
}

TreeTile.Super = Tile.prototype;
TreeTile.prototype = extend(new Tile(), {

  render: function(screen, level, x, y) {
    var col = Color.get(10, 30, 151, level.grassColor);
    var barkCol1 = Color.get(10, 30, 430, level.grassColor);
    var barkCol2 = Color.get(10, 30, 320, level.grassColor);

    var u = level.getTile(x, y - 1) == this;
    var l = level.getTile(x - 1, y) == this;
    var r = level.getTile(x + 1, y) == this;
    var d = level.getTile(x, y + 1) == this;
    var ul = level.getTile(x - 1, y - 1) == this;
    var ur = level.getTile(x + 1, y - 1) == this;
    var dl = level.getTile(x - 1, y + 1) == this;
    var dr = level.getTile(x + 1, y + 1) == this;

    if (u && ul && l) {
      screen.render(x * 16 + 0, y * 16 + 0, 10 + 1 * 32, col, 0);
    } else {
      screen.render(x * 16 + 0, y * 16 + 0, 9 + 0 * 32, col, 0);
    }
    if (u && ur && r) {
      screen.render(x * 16 + 8, y * 16 + 0, 10 + 2 * 32, barkCol2, 0);
    } else {
      screen.render(x * 16 + 8, y * 16 + 0, 10 + 0 * 32, col, 0);
    }
    if (d && dl && l) {
      screen.render(x * 16 + 0, y * 16 + 8, 10 + 2 * 32, barkCol2, 0);
    } else {
      screen.render(x * 16 + 0, y * 16 + 8, 9 + 1 * 32, barkCol1, 0);
    }
    if (d && dr && r) {
      screen.render(x * 16 + 8, y * 16 + 8, 10 + 1 * 32, col, 0);
    } else {
      screen.render(x * 16 + 8, y * 16 + 8, 10 + 3 * 32, barkCol2, 0);
    }
  },

  tick: function(level, xt, yt) {
    var damage = level.getData(xt, yt);
    if (damage > 0) level.setData(xt, yt, damage - 1);
  },

  mayPass: function(level, x, y, e) {
    return false;
  },

  // hurt: function(level, x, y, source, dmg, attackDir) {
  //  hurt(level, x, y, dmg);
  // },

  interact: function(level, xt, yt, player, item, attackDir) {
    if (item instanceof ToolItem) {
      var tool = item;
      if (tool.type == ToolType.axe) {
        if (player.payStamina(4 - tool.level)) {
          this.hurt(level, xt, yt, random.nextInt(10) + (tool.level) * 5 + 10);
          return true;
        }
      }
    }
    return false;
  },

  //hurt: function(level, x, y, dmg) {
  hurt: function(level, x, y, source, dmg, attackDir) {
    dmg || (dmg = source);

    var count = random.nextInt(10) == 0 ? 1 : 0;
    for (var i = 0; i < count; i++) {
      level.add(new ItemEntity(new ResourceItem(Resource.apple), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
    }

    var damage = level.getData(x, y) + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    if (damage >= 20) {
      count = random.nextInt(2) + 1;
      for (i = 0; i < count; i++) {
        level.add(new ItemEntity(new ResourceItem(Resource.wood), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
      }
      count = random.nextInt(random.nextInt(4) + 1);
      for (i = 0; i < count; i++) {
        level.add(new ItemEntity(new ResourceItem(Resource.acorn), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
      }
      level.setTile(x, y, Tile.grass, 0);
    } else {
      level.setData(x, y, damage);
    }
  }

});

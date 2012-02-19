// package com.mojang.ld22.entity;

// import java.util.List;
// import java.util.Random;

// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.Item;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;

function Entity() {
  this.x = null;
  this.y = null;
  this.xr = 6;
  this.yr = 6;
  this.removed = false;
  this.level = null;
}

Entity.prototype = {

  render: function(screen) {},

  tick: function() {},

  remove: function() {
    removed = true;
  },

  init: function(level) {
    this.level = level;
  },

  intersects: function(x0, y0, x1, y1) {
    var x = this.x, y = this.y, xr = this.xr, yr = this.yr;
    return !(x + xr < x0 || y + yr < y0 || x - xr > x1 || y - yr > y1);
  },

  blocks: function(/* Entity */ e) {
    return false;
  },

  hurtMob: function(mob, dmg, attackDir) { },
  hurtTile: function(tile, x, y, dmg) { },

  move: function(xa, ya) {
    if (xa != 0 || ya != 0) {
      var stopped = true;
      if (xa != 0 && this.move2(xa, 0)) stopped = false;
      if (ya != 0 && this.move2(0, ya)) stopped = false;
      if (!stopped) {
        var xt = this.x >> 4;
        var yt = this.y >> 4;
        this.level.getTile(xt, yt).steppedOn(this.level, xt, yt, this);
      }
      return !stopped;
    }
    return true;
  },

  move2: function(xa, ya) {
    var x = this.x, y = this.y, xr = this.xr, yr = this.yr;
    if (xa != 0 && ya != 0) throw "Move2 can only move along one axis at a time!";

    var xto0 = ((x) - xr) >> 4,
        yto0 = ((y) - yr) >> 4,
        xto1 = ((x) + xr) >> 4,
        yto1 = ((y) + yr) >> 4,
        xt0 = ((x + xa) - xr) >> 4,
        yt0 = ((y + ya) - yr) >> 4,
        xt1 = ((x + xa) + xr) >> 4,
        yt1 = ((y + ya) + yr) >> 4,
        blocked = false,
        yt, xt, i, e, wasInside, isInside;

    for (yt = yt0; yt <= yt1; yt++)
      for (xt = xt0; xt <= xt1; xt++) {
        if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
        level.getTile(xt, yt).bumpedInto(level, xt, yt, this);
        if (!level.getTile(xt, yt).mayPass(level, xt, yt, this)) {
          blocked = true;
          return false;
        }
      }
    if (blocked) return false;

    wasInside = this.level.getEntities(x - xr, y - yr, x + xr, y + yr);
    isInside = this.level.getEntities(x + xa - xr, y + ya - yr, x + xa + xr, y + ya + yr);
    for (i = 0; i < isInside.length; i++) {
      e = isInside[i];
      if (e == this) continue;

      e.touchedBy(this);
    }
    isInside.removeAll(wasInside); // TODO : implement removeAll
    for (i = 0; i < isInside.length; i++) {
      e = isInside[i];
      if (e == this) continue;

      if (e.blocks(this)) {
        return false;
      }
    }

    x += xa;
    y += ya;
    return true;
  },

  touchedBy: function(entity) { },

  isBlockable: function(mob) {
    return true;
  },

  touchItem: function(itemEntity) { },

  canSwim: function() {
    return false;
  },

  interact: function(player, item, attackDir) {
    return item.interact(player, this, attackDir);
  },

  use: function(player, attackDir) {
    return false;
  },

  getLightRadius: function() {
    return 0;
  }

};




  // protected void touchedBy(Entity entity) {
  // }

  // public boolean isBlockableBy(Mob mob) {
  //  return true;
  // }

  // public void touchItem(ItemEntity itemEntity) {
  // }

  // public boolean canSwim() {
  //  return false;
  // }

  // public boolean interact(Player player, Item item, int attackDir) {
  //  return item.interact(player, this, attackDir);
  // }

  // public boolean use(Player player, int attackDir) {
  //  return false;
  // }

  // public int getLightRadius() {
  //  return 0;
  // }




  // protected final Random random = new Random();
  // public int x, y;
  // public int xr = 6;
  // public int yr = 6;
  // public boolean removed;
  // public Level level;

  // public void render(Screen screen) {  }

  // public void tick() { }

  // public void remove() {
  //  removed = true;
  // }

  // public final void init(Level level) {
  //  this.level = level;
  // }

  // public boolean intersects(int x0, int y0, int x1, int y1) {
  //  return !(x + xr < x0 || y + yr < y0 || x - xr > x1 || y - yr > y1);
  // }

  // public boolean blocks(Entity e) {
  //  return false;
  // }

  // public void hurt(Mob mob, int dmg, int attackDir) {  }

  // public void hurt(Tile tile, int x, int y, int dmg) { }

  // public boolean move(int xa, int ya) {
  //  if (xa != 0 || ya != 0) {
  //    boolean stopped = true;
  //    if (xa != 0 && move2(xa, 0)) stopped = false;
  //    if (ya != 0 && move2(0, ya)) stopped = false;
  //    if (!stopped) {
  //      int xt = x >> 4;
  //      int yt = y >> 4;
  //      level.getTile(xt, yt).steppedOn(level, xt, yt, this);
  //    }
  //    return !stopped;
  //  }
  //  return true;
  // }

  // protected boolean move2(int xa, int ya) {
  //  if (xa != 0 && ya != 0) throw new IllegalArgumentException("Move2 can only move along one axis at a time!");

  //  int xto0 = ((x) - xr) >> 4;
  //  int yto0 = ((y) - yr) >> 4;
  //  int xto1 = ((x) + xr) >> 4;
  //  int yto1 = ((y) + yr) >> 4;

  //  int xt0 = ((x + xa) - xr) >> 4;
  //  int yt0 = ((y + ya) - yr) >> 4;
  //  int xt1 = ((x + xa) + xr) >> 4;
  //  int yt1 = ((y + ya) + yr) >> 4;
  //  boolean blocked = false;
  //  for (int yt = yt0; yt <= yt1; yt++)
  //    for (int xt = xt0; xt <= xt1; xt++) {
  //      if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
  //      level.getTile(xt, yt).bumpedInto(level, xt, yt, this);
  //      if (!level.getTile(xt, yt).mayPass(level, xt, yt, this)) {
  //        blocked = true;
  //        return false;
  //      }
  //    }
  //  if (blocked) return false;

  //  List<Entity> wasInside = level.getEntities(x - xr, y - yr, x + xr, y + yr);
  //  List<Entity> isInside = level.getEntities(x + xa - xr, y + ya - yr, x + xa + xr, y + ya + yr);
  //  for (int i = 0; i < isInside.size(); i++) {
  //    Entity e = isInside.get(i);
  //    if (e == this) continue;

  //    e.touchedBy(this);
  //  }
  //  isInside.removeAll(wasInside);
  //  for (int i = 0; i < isInside.size(); i++) {
  //    Entity e = isInside.get(i);
  //    if (e == this) continue;

  //    if (e.blocks(this)) {
  //      return false;
  //    }
  //  }

  //  x += xa;
  //  y += ya;
  //  return true;
  // }


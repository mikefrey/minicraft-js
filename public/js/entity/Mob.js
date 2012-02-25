// package com.mojang.ld22.entity;

// import com.mojang.ld22.entity.particle.TextParticle;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;
// import com.mojang.ld22.sound.Sound;

function Mob() {
  this.walkDist = 0;
  this.dir = 0;
  this.hurtTime = 0;
  this.xKnockback = 0;
  this.yKnockback = 0;
  this.maxHealth = 10;
  this.health = this.maxHealth;
  this.swimTimer = 0;
  this.tickTime = 0;

  this.x = this.y = 8;
  this.xr = 4;
  this.yr = 3;
}

Mob.Super = Entity.prototype;
Mob.prototype = extend(new Entity(), {

  tick: function() {
    this.tickTime++;
    if (this.level.getTile(this.x >> 4, this.y >> 4) == Tile.lava) {
      this.hurt(this, 4, dir ^ 1);
    }

    if (this.health <= 0) {
      this.die();
    }
    if (this.hurtTime > 0) this.hurtTime--;
  },

  die: function() {
    this.remove();
  },

  move: function(xa, ya) {
    if (this.isSwimming()) {
      if (swimTimer++ % 2 == 0) return true;
    }
    if (this.xKnockback < 0) {
      this.move2(-1, 0);
      this.xKnockback++;
    }
    if (this.xKnockback > 0) {
      this.move2(1, 0);
      this.xKnockback--;
    }
    if (this.yKnockback < 0) {
      this.move2(0, -1);
      this.yKnockback++;
    }
    if (this.yKnockback > 0) {
      this.move2(0, 1);
      this.yKnockback--;
    }
    if (this.hurtTime > 0) return true;
    if (xa != 0 || ya != 0) {
      this.walkDist++;
      if (xa < 0) dir = 2;
      if (xa > 0) dir = 3;
      if (ya < 0) dir = 1;
      if (ya > 0) dir = 0;
    }
    return Mob.Super.move.call(this, xa, ya);
  },

  isSwimming: function() {
    var tile = this.level.getTile(this.x >> 4, this.y >> 4);
    return tile == Tile.water || tile == Tile.lava; // TODO : comparing tiles this way may not work.
  },

  blocks: function(/* Entity */ e) {
    return e.isBlockableBy(this);
  },

  // hurt: function(tile, x, y, damage) {
  //  var attackDir = this.dir ^ 1;
  //  this.doHurt(damage, attackDir);
  // },

  // hurt: function(mob, damage, attackDir) {
  //  this.doHurt(damage, attackDir);
  // },

  hurt: function(damage, attackDir) {
    attackDir = attackDir == null ? this.dir ^ 1 : attackDir;
    this.doHurt(damage, attackDir);
  },

  heal: function(heal) {
    if (this.hurtTime > 0) return;

    this.level.add(new TextParticle(heal, x, y, Color.get(-1, 50, 50, 50)));
    health += heal;
    health = Math.min(health, maxHealth);
  },

  doHurt: function(damage, attackDir) {
    if (this.hurtTime > 0) return;

    if (this.level.player != null) {
      var xd = this.level.player.x - x;
      var yd = this.level.player.y - y;
      if (xd * xd + yd * yd < 80 * 80) {
        Sound.mosterHurt.play();
      }
    }
    this.level.add(new TextParticle(damage, x, y, Color.get(-1, 500, 500, 500)));
    this.health -= damage;
    if (attackDir == 0) this.yKnockback = +6;
    if (attackDir == 1) this.yKnockback = -6;
    if (attackDir == 2) this.xKnockback = -6;
    if (attackDir == 3) this.xKnockback = +6;
    this.hurtTime = 10;
  },

  findStartPos: function(level) {
    var x = random.nextInt(level.w);
    var y = random.nextInt(level.h);
    var xx = x * 16 + 8;
    var yy = y * 16 + 8;

    if (level.player != null) {
      var xd = level.player.x - xx;
      var yd = level.player.y - yy;
      if (xd * xd + yd * yd < 80 * 80) return false;
    }

    var r = level.monsterDensity * 16;
    if (level.getEntities(xx - r, yy - r, xx + r, yy + r).length > 0) return false;

    if (level.getTile(x, y).mayPass(level, x, y, this)) {
      this.x = xx;
      this.y = yy;
      return true;
    }

    return false;
  }

});


// public class Mob extends Entity {
//  protected int walkDist = 0;
//  protected int dir = 0;
//  public int hurtTime = 0;
//  protected int xKnockback, yKnockback;
//  public int maxHealth = 10;
//  public int health = maxHealth;
//  public int swimTimer = 0;
//  public int tickTime = 0;

//  public Mob() {
//    x = y = 8;
//    xr = 4;
//    yr = 3;
//  }

//  public void tick() {
//    tickTime++;
//    if (level.getTile(x >> 4, y >> 4) == Tile.lava) {
//      hurt(this, 4, dir ^ 1);
//    }

//    if (health <= 0) {
//      die();
//    }
//    if (hurtTime > 0) hurtTime--;
//  }

//  protected void die() {
//    remove();
//  }

//  public boolean move(int xa, int ya) {
//    if (isSwimming()) {
//      if (swimTimer++ % 2 == 0) return true;
//    }
//    if (xKnockback < 0) {
//      move2(-1, 0);
//      xKnockback++;
//    }
//    if (xKnockback > 0) {
//      move2(1, 0);
//      xKnockback--;
//    }
//    if (yKnockback < 0) {
//      move2(0, -1);
//      yKnockback++;
//    }
//    if (yKnockback > 0) {
//      move2(0, 1);
//      yKnockback--;
//    }
//    if (hurtTime > 0) return true;
//    if (xa != 0 || ya != 0) {
//      walkDist++;
//      if (xa < 0) dir = 2;
//      if (xa > 0) dir = 3;
//      if (ya < 0) dir = 1;
//      if (ya > 0) dir = 0;
//    }
//    return super.move(xa, ya);
//  }

//  protected boolean isSwimming() {
//    Tile tile = level.getTile(x >> 4, y >> 4);
//    return tile == Tile.water || tile == Tile.lava;
//  }

//  public boolean blocks(Entity e) {
//    return e.isBlockableBy(this);
//  }

//  public void hurt(Tile tile, int x, int y, int damage) {
//    int attackDir = dir ^ 1;
//    doHurt(damage, attackDir);
//  }

//  public void hurt(Mob mob, int damage, int attackDir) {
//    doHurt(damage, attackDir);
//  }

//  public void heal(int heal) {
//    if (hurtTime > 0) return;

//    level.add(new TextParticle("" + heal, x, y, Color.get(-1, 50, 50, 50)));
//    health += heal;
//    if (health > maxHealth) health = maxHealth;
//  }

//  protected void doHurt(int damage, int attackDir) {
//    if (hurtTime > 0) return;

//    if (level.player != null) {
//      int xd = level.player.x - x;
//      int yd = level.player.y - y;
//      if (xd * xd + yd * yd < 80 * 80) {
//        Sound.monsterHurt.play();
//      }
//    }
//    level.add(new TextParticle("" + damage, x, y, Color.get(-1, 500, 500, 500)));
//    health -= damage;
//    if (attackDir == 0) yKnockback = +6;
//    if (attackDir == 1) yKnockback = -6;
//    if (attackDir == 2) xKnockback = -6;
//    if (attackDir == 3) xKnockback = +6;
//    hurtTime = 10;
//  }

//  public boolean findStartPos(Level level) {
//    int x = random.nextInt(level.w);
//    int y = random.nextInt(level.h);
//    int xx = x * 16 + 8;
//    int yy = y * 16 + 8;

//    if (level.player != null) {
//      int xd = level.player.x - xx;
//      int yd = level.player.y - yy;
//      if (xd * xd + yd * yd < 80 * 80) return false;
//    }

//    int r = level.monsterDensity * 16;
//    if (level.getEntities(xx - r, yy - r, xx + r, yy + r).size() > 0) return false;

//    if (level.getTile(x, y).mayPass(level, x, y, this)) {
//      this.x = xx;
//      this.y = yy;
//      return true;
//    }

//    return false;
//  }
// }

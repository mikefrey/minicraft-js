// package com.mojang.ld22.entity;

// import java.util.List;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;

function Spark(owner, xa, ya) {
  this.owner = owner;
  this.xx = this.x = owner.x;
  this.yy = this.y = owner.y;
  this.xr = 0;
  this.yr = 0;

  this.xa = xa;
  this.ya = ya;

  this.lifeTime = 60 * 10 + random.nextInt(30);

  this.time = 0;
}

Spark.Super = Entity.prototype;
Spark.prototype = extend(new Entity(), {

  tick: function() {
    this.time++;
    if (this.time >= this.lifeTime) {
      this.remove();
      return;
    }
    this.xx += xa;
    this.yy += ya;
    this.x = Math.round(this.xx);
    this.y = Math.round(this.yy);
    toHit = this.level.getEntities(this.x, this.y, this.x, this.y);
    for (var i = 0; i < toHit.length; i++) {
      var e = toHit[i];
      if (e instanceof Mob && !(e instanceof AirWizard)) {
        e.hurt(owner, 1, e.dir ^ 1);
      }
    }
  },

  isBlockableBy: function(mob) {
    return false;
  },

  render: function(screen) {
    if (this.time >= lifeTime - 6 * 20) {
      if ((this.time / 6 % 2 | 0) == 0) return;
    }

    var xt = 8;
    var yt = 13;

    screen.render(this.x - 4, this.y - 4 - 2, xt + yt * 32, Color.get(-1, 555, 555, 555), random.nextInt(4));
    screen.render(this.x - 4, this.y - 4 + 2, xt + yt * 32, Color.get(-1, 0, 0, 0), random.nextInt(4));
  }

});


// public class Spark extends Entity {
//  private int lifeTime;
//  public double xa, ya;
//  public double xx, yy;
//  private int time;
//  private AirWizard owner;

//  public Spark(AirWizard owner, double xa, double ya) {
//    this.owner = owner;
//    xx = this.x = owner.x;
//    yy = this.y = owner.y;
//    xr = 0;
//    yr = 0;

//    this.xa = xa;
//    this.ya = ya;

//    lifeTime = 60 * 10 + random.nextInt(30);
//  }

//  public void tick() {
//    time++;
//    if (time >= lifeTime) {
//      remove();
//      return;
//    }
//    xx += xa;
//    yy += ya;
//    x = (int) xx;
//    y = (int) yy;
//    List<Entity> toHit = level.getEntities(x, y, x, y);
//    for (int i = 0; i < toHit.size(); i++) {
//      Entity e = toHit.get(i);
//      if (e instanceof Mob && !(e instanceof AirWizard)) {
//        e.hurt(owner, 1, ((Mob) e).dir ^ 1);
//      }
//    }
//  }

//  public boolean isBlockableBy(Mob mob) {
//    return false;
//  }

//  public void render(Screen screen) {
//    if (time >= lifeTime - 6 * 20) {
//      if (time / 6 % 2 == 0) return;
//    }

//    int xt = 8;
//    int yt = 13;

//    screen.render(x - 4, y - 4 - 2, xt + yt * 32, Color.get(-1, 555, 555, 555), random.nextInt(4));
//    screen.render(x - 4, y - 4 + 2, xt + yt * 32, Color.get(-1, 000, 000, 000), random.nextInt(4));
//  }
// }

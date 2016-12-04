// package com.mojang.ld22.entity;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.ResourceItem;
// import com.mojang.ld22.item.resource.Resource;


class Slime extends Mob {
  constructor(lvl) {
    super()
    this.lvl = lvl
    this.x = random.nextInt(64 * 16)
    this.y = random.nextInt(64 * 16)
    this.health = this.maxHealth = lvl * lvl * 5

    this.xa = 0
    this.ya = 0
    this.jumpTime = 0
  }

  tick() {
    super.tick()

    const speed = 1
    if (!this.move(this.xa * speed, this.ya * speed) || random.nextInt(40) == 0) {
      if (this.jumpTime <= -10) {
        this.xa = (random.nextInt(3) - 1)
        this.ya = (random.nextInt(3) - 1)

        if (this.level.player != null) {
          const xd = this.level.player.x - this.x
          const yd = this.level.player.y - this.y
          if (xd * xd + yd * yd < 50 * 50) {
            if (xd < 0) this.xa = -1
            if (xd > 0) this.xa = +1
            if (yd < 0) this.ya = -1
            if (yd > 0) this.ya = +1
          }
        }

        if (this.xa != 0 || this.ya != 0) this.jumpTime = 10
      }
    }

    this.jumpTime--
    if (this.jumpTime == 0) {
      this.xa = this.ya = 0
    }
  }

  die() {
    super.die()

    const count = random.nextInt(2) + 1
    for (let i = 0; i < this.count; i++) {
      this.level.add(new ItemEntity(new ResourceItem(Resource.slime), this.x + random.nextInt(11) - 5, this.y + random.nextInt(11) - 5))
    }

    if (this.level.player != null) {
      this.level.player.score += 25*this.lvl
    }
  }

  render(screen) {
    let xt = 0
    const yt = 18
    const xo = this.x - 8
    let yo = this.y - 11

    if (this.jumpTime > 0) {
      xt += 2
      yo -= 4
    }

    let col = Color.get(-1, 10, 252, 555)
    if (this.lvl == 2) col = Color.get(-1, 100, 522, 555)
    if (this.lvl == 3) col = Color.get(-1, 111, 444, 555)
    if (this.lvl == 4) col = Color.get(-1, 0, 111, 224)

    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555)
    }

    screen.render(xo + 0, yo + 0, xt + yt * 32, col, 0)
    screen.render(xo + 8, yo + 0, xt + 1 + yt * 32, col, 0)
    screen.render(xo + 0, yo + 8, xt + (yt + 1) * 32, col, 0)
    screen.render(xo + 8, yo + 8, xt + 1 + (yt + 1) * 32, col, 0)
  }

  touchedBy(entity) {
    if (entity instanceof Player) {
      entity.hurt(this, this.lvl, this.dir)
    }
  }
}




// public class Slime extends Mob {
//  private int xa, ya;
//  private int jumpTime = 0;
//  private int lvl;

//  public Slime(int lvl) {
//    this.lvl = lvl;
//    x = random.nextInt(64 * 16);
//    y = random.nextInt(64 * 16);
//    health = maxHealth = lvl * lvl * 5;
//  }

//  public void tick() {
//    super.tick();

//    int speed = 1;
//    if (!move(xa * speed, ya * speed) || random.nextInt(40) == 0) {
//      if (jumpTime <= -10) {
//        xa = (random.nextInt(3) - 1);
//        ya = (random.nextInt(3) - 1);

//        if (level.player != null) {
//          int xd = level.player.x - x;
//          int yd = level.player.y - y;
//          if (xd * xd + yd * yd < 50 * 50) {
//            if (xd < 0) xa = -1;
//            if (xd > 0) xa = +1;
//            if (yd < 0) ya = -1;
//            if (yd > 0) ya = +1;
//          }

//        }

//        if (xa != 0 || ya != 0) jumpTime = 10;
//      }
//    }

//    jumpTime--;
//    if (jumpTime == 0) {
//      xa = ya = 0;
//    }
//  }

//  protected void die() {
//    super.die();

//    int count = random.nextInt(2) + 1;
//    for (int i = 0; i < count; i++) {
//      level.add(new ItemEntity(new ResourceItem(Resource.slime), x + random.nextInt(11) - 5, y + random.nextInt(11) - 5));
//    }

//    if (level.player != null) {
//      level.player.score += 25*lvl;
//    }

//  }

//  public void render(Screen screen) {
//    int xt = 0;
//    int yt = 18;

//    int xo = x - 8;
//    int yo = y - 11;

//    if (jumpTime > 0) {
//      xt += 2;
//      yo -= 4;
//    }

//    int col = Color.get(-1, 10, 252, 555);
//    if (lvl == 2) col = Color.get(-1, 100, 522, 555);
//    if (lvl == 3) col = Color.get(-1, 111, 444, 555);
//    if (lvl == 4) col = Color.get(-1, 000, 111, 224);

//    if (hurtTime > 0) {
//      col = Color.get(-1, 555, 555, 555);
//    }

//    screen.render(xo + 0, yo + 0, xt + yt * 32, col, 0);
//    screen.render(xo + 8, yo + 0, xt + 1 + yt * 32, col, 0);
//    screen.render(xo + 0, yo + 8, xt + (yt + 1) * 32, col, 0);
//    screen.render(xo + 8, yo + 8, xt + 1 + (yt + 1) * 32, col, 0);
//  }

//  protected void touchedBy(Entity entity) {
//    if (entity instanceof Player) {
//      entity.hurt(this, lvl, dir);
//    }
//  }
// }

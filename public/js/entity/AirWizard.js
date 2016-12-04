// package com.mojang.ld22.entity;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.ResourceItem;
// import com.mojang.ld22.item.resource.Resource;
// import com.mojang.ld22.sound.Sound;

class AirWizard extends Mob {
  constructor() {
    super()
    this.x = random.nextInt(64 * 16)
    this.y = random.nextInt(64 * 16)
    this.health = this.maxHealth = 2000

    this.xa = 0
    this.ya = 0
    this.randomWalkTime = 0
    this.attackDelay = 0
    this.attackTime = 0
    this.attackType = 0
  }

  tick() {
    super.tick()

    let speed
    let dir
    let xd
    let yd

    if (this.attackDelay > 0) {
      this.dir = (this.attackDelay - 45) / 4 % 4 | 0
      this.dir = (this.dir * 2 % 4) + (this.dir / 2) | 0
      if (this.attackDelay < 45) {
        this.dir = 0
      }
      this.attackDelay--
      if (this.attackDelay == 0) {
        this.attackType = 0
        if (this.health < 1000) this.attackType = 1
        if (this.health < 200) this.attackType = 2
        this.attackTime = 60 * 2
      }
      return
    }

    if (this.attackTime > 0) {
      this.attackTime--
      dir = this.attackTime * 0.25 * (this.attackTime % 2 * 2 - 1)
      speed = (0.7) + attackType * 0.2
      this.level.add(new Spark(this, Math.cos(dir) * speed, Math.sin(dir) * speed))
      return
    }

    if (this.level.player != null && this.randomWalkTime == 0) {
      xd = this.level.player.x - this.x
      yd = this.level.player.y - this.y
      if (xd * xd + yd * yd < 32 * 32) {
        this.xa = 0
        this.ya = 0
        if (xd < 0) this.xa = +1
        if (xd > 0) this.xa = -1
        if (yd < 0) this.ya = +1
        if (yd > 0) this.ya = -1
      } else if (xd * xd + yd * yd > 80 * 80) {
        this.xa = 0
        this.ya = 0
        if (xd < 0) this.xa = -1
        if (xd > 0) this.xa = +1
        if (yd < 0) this.ya = -1
        if (yd > 0) this.ya = +1
      }
    }

    speed = (this.tickTime % 4) == 0 ? 0 : 1
    if (!this.move(this.xa * speed, this.ya * speed) || random.nextInt(100) == 0) {
      this.randomWalkTime = 30
      this.xa = (random.nextInt(3) - 1)
      this.ya = (random.nextInt(3) - 1)
    }
    if (this.randomWalkTime > 0) {
      this.randomWalkTime--
      if (this.level.player != null && this.randomWalkTime == 0) {
        xd = this.level.player.x - this.x
        yd = this.level.player.y - this.y
        if (random.nextInt(4) == 0 && xd * xd + yd + yd < 50 * 50) {
          if (this.attackDelay == 0 && this.attackTime == 0) {
            this.attackDelay = 60 * 2
          }
        }
      }
    }
  }

  doHurt(damage, attackDir) {
    super.doHurt(damage, attackDir)
    if (this.attackDelay == 0 && this.attackTime == 0) {
      this.attackDelay = 60 * 2
    }
  }

  render(screen) {
    let xt = 8
    const yt = 14

    let flip1 = (this.walkDist >> 3) & 1
    let flip2 = (this.walkDist >> 3) & 1

    if (this.dir == 1) {
      xt += 2
    }
    if (this.dir > 1) {
      flip1 = 0
      flip2 = (this.walkDist >> 4) & 1
      if (this.dir == 2) {
        flip1 = 1
      }
      xt += 4 + ((this.walkDist >> 3) & 1) * 2
    }

    const xo = this.x - 8
    const yo = this.y - 11

    let col1 = Color.get(-1, 100, 500, 555)
    let col2 = Color.get(-1, 100, 500, 532)
    if (this.health < 200) {
      if (this.tickTime / 3 % 2 | 0 == 0) {
        col1 = Color.get(-1, 500, 100, 555)
        col2 = Color.get(-1, 500, 100, 532)
      }
    } else if (this.health < 1000) {
      if ((this.tickTime / 5 % 4 | 0) == 0) {
        col1 = Color.get(-1, 500, 100, 555)
        col2 = Color.get(-1, 500, 100, 532)
      }
    }
    if (this.hurtTime > 0) {
      col1 = Color.get(-1, 555, 555, 555)
      col2 = Color.get(-1, 555, 555, 555)
    }

    screen.render(xo + 8 * flip1, yo + 0, xt + yt * 32, col1, flip1)
    screen.render(xo + 8 - 8 * flip1, yo + 0, xt + 1 + yt * 32, col1, flip1)
    screen.render(xo + 8 * flip2, yo + 8, xt + (yt + 1) * 32, col2, flip2)
    screen.render(xo + 8 - 8 * flip2, yo + 8, xt + 1 + (yt + 1) * 32, col2, flip2)
  }

  touchedBy(entity) {
    if (entity instanceof Player) {
      entity.hurt(this, 3, this.dir)
    }
  }

  dir() {
    super.die()
    if (this.level.player != null) {
      this.level.player.score += 1000
      this.level.player.gameWon()
    }
    Sound.bossdeath.play()
  }
}




// public class AirWizard extends Mob {
//  private int xa, ya;
//  private int randomWalkTime = 0;
//  private int attackDelay = 0;
//  private int attackTime = 0;
//  private int attackType = 0;

//  public AirWizard() {
//    x = random.nextInt(64 * 16);
//    y = random.nextInt(64 * 16);
//    health = maxHealth = 2000;
//  }

//  public void tick() {
//    super.tick();

//    if (attackDelay > 0) {
//      dir = (attackDelay - 45) / 4 % 4;
//      dir = (dir * 2 % 4) + (dir / 2);
//      if (attackDelay < 45) {
//        dir = 0;
//      }
//      attackDelay--;
//      if (attackDelay == 0) {
//        attackType = 0;
//        if (health < 1000) attackType = 1;
//        if (health < 200) attackType = 2;
//        attackTime = 60 * 2;
//      }
//      return;
//    }

//    if (attackTime > 0) {
//      attackTime--;
//      double dir = attackTime * 0.25 * (attackTime % 2 * 2 - 1);
//      double speed = (0.7) + attackType * 0.2;
//      level.add(new Spark(this, Math.cos(dir) * speed, Math.sin(dir) * speed));
//      return;
//    }

//    if (level.player != null && randomWalkTime == 0) {
//      int xd = level.player.x - x;
//      int yd = level.player.y - y;
//      if (xd * xd + yd * yd < 32 * 32) {
//        xa = 0;
//        ya = 0;
//        if (xd < 0) xa = +1;
//        if (xd > 0) xa = -1;
//        if (yd < 0) ya = +1;
//        if (yd > 0) ya = -1;
//      } else if (xd * xd + yd * yd > 80 * 80) {
//        xa = 0;
//        ya = 0;
//        if (xd < 0) xa = -1;
//        if (xd > 0) xa = +1;
//        if (yd < 0) ya = -1;
//        if (yd > 0) ya = +1;
//      }
//    }

//    int speed = (tickTime % 4) == 0 ? 0 : 1;
//    if (!move(xa * speed, ya * speed) || random.nextInt(100) == 0) {
//      randomWalkTime = 30;
//      xa = (random.nextInt(3) - 1);
//      ya = (random.nextInt(3) - 1);
//    }
//    if (randomWalkTime > 0) {
//      randomWalkTime--;
//      if (level.player != null && randomWalkTime == 0) {
//        int xd = level.player.x - x;
//        int yd = level.player.y - y;
//        if (random.nextInt(4) == 0 && xd * xd + yd * yd < 50 * 50) {
//          if (attackDelay == 0 && attackTime == 0) {
//            attackDelay = 60 * 2;
//          }
//        }
//      }
//    }
//  }

//  protected void doHurt(int damage, int attackDir) {
//    super.doHurt(damage, attackDir);
//    if (attackDelay == 0 && attackTime == 0) {
//      attackDelay = 60 * 2;
//    }
//  }

//  public void render(Screen screen) {
//    int xt = 8;
//    int yt = 14;

//    int flip1 = (walkDist >> 3) & 1;
//    int flip2 = (walkDist >> 3) & 1;

//    if (dir == 1) {
//      xt += 2;
//    }
//    if (dir > 1) {

//      flip1 = 0;
//      flip2 = ((walkDist >> 4) & 1);
//      if (dir == 2) {
//        flip1 = 1;
//      }
//      xt += 4 + ((walkDist >> 3) & 1) * 2;
//    }

//    int xo = x - 8;
//    int yo = y - 11;

//    int col1 = Color.get(-1, 100, 500, 555);
//    int col2 = Color.get(-1, 100, 500, 532);
//    if (health < 200) {
//      if (tickTime / 3 % 2 == 0) {
//        col1 = Color.get(-1, 500, 100, 555);
//        col2 = Color.get(-1, 500, 100, 532);
//      }
//    } else if (health < 1000) {
//      if (tickTime / 5 % 4 == 0) {
//        col1 = Color.get(-1, 500, 100, 555);
//        col2 = Color.get(-1, 500, 100, 532);
//      }
//    }
//    if (hurtTime > 0) {
//      col1 = Color.get(-1, 555, 555, 555);
//      col2 = Color.get(-1, 555, 555, 555);
//    }

//    screen.render(xo + 8 * flip1, yo + 0, xt + yt * 32, col1, flip1);
//    screen.render(xo + 8 - 8 * flip1, yo + 0, xt + 1 + yt * 32, col1, flip1);
//    screen.render(xo + 8 * flip2, yo + 8, xt + (yt + 1) * 32, col2, flip2);
//    screen.render(xo + 8 - 8 * flip2, yo + 8, xt + 1 + (yt + 1) * 32, col2, flip2);
//  }

//  protected void touchedBy(Entity entity) {
//    if (entity instanceof Player) {
//      entity.hurt(this, 3, dir);
//    }
//  }

//  protected void die() {
//    super.die();
//    if (level.player != null) {
//      level.player.score += 1000;
//      level.player.gameWon();
//    }
//    Sound.bossdeath.play();
//  }

// }

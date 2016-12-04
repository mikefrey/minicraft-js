// package com.mojang.ld22.entity.particle;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;

class TextParticle extends Entity {
  constructor(msg, x, y, col) {
    super()
    this.msg = msg
    this.x = x
    this.y = y
    this.col = col

    this.time = 0
    this.xx = x
    this.yy = y
    this.zz = 2
    this.xa = random.nextGaussian() * 0.3
    this.ya = random.nextGaussian() * 0.2
    this.za = random.nextFloat() * 0.7 + 2
  }

  tick() {
    this.time++
    if (this.time > 60) {
      this.remove()
    }
    this.xx += this.xa
    this.yy += this.ya
    this.zz += this.za
    if (this.zz < 0) {
      this.zz = 0
      this.za *= -0.5
      this.xa *= 0.6
      this.ya *= 0.6
    }
    this.za -= 0.15
    this.x = Math.round(this.xx)
    this.y = Math.round(this.yy)
  }

  render(screen) {
    const z = Math.round(this.zz)
    Font.draw(this.msg, screen, this.x - this.msg.length * 4 + 1, this.y - z + 1, Color.get(-1, 0, 0, 0))
    Font.draw(this.msg, screen, this.x - this.msg.length * 4, this.y - z, this.col)
  }
}

// TextParticle.prototype = new Entity();
// TextParticle.Super = Entity.prototype;


// public class TextParticle extends Entity {
//  private String msg;
//  private int col;
//  private int time = 0;
//  public double xa, ya, za;
//  public double xx, yy, zz;

//  public TextParticle(String msg, int x, int y, int col) {
//    this.msg = msg;
//    this.x = x;
//    this.y = y;
//    this.col = col;
//    xx = x;
//    yy = y;
//    zz = 2;
//    xa = random.nextGaussian() * 0.3;
//    ya = random.nextGaussian() * 0.2;
//    za = random.nextFloat() * 0.7 + 2;
//  }

//  public void tick() {
//    time++;
//    if (time > 60) {
//      remove();
//    }
//    xx += xa;
//    yy += ya;
//    zz += za;
//    if (zz < 0) {
//      zz = 0;
//      za *= -0.5;
//      xa *= 0.6;
//      ya *= 0.6;
//    }
//    za -= 0.15;
//    x = (int) xx;
//    y = (int) yy;
//  }

//  public void render(Screen screen) {
// //   Font.draw(msg, screen, x - msg.length() * 4, y, Color.get(-1, 0, 0, 0));
//    Font.draw(msg, screen, x - msg.length() * 4 + 1, y - (int) (zz) + 1, Color.get(-1, 0, 0, 0));
//    Font.draw(msg, screen, x - msg.length() * 4, y - (int) (zz), col);
//  }

// }

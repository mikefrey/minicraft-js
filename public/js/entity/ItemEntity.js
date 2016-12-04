// package com.mojang.ld22.entity;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.Item;
// import com.mojang.ld22.sound.Sound;

class ItemEntity extends Entity {
  constructor(item, x, y) {
    super()
    this.item = item
    this.xx = this.x = x
    this.yy = this.y = y
    this.xr = 3
    this.xy = 3

    this.zz = 2
    this.xa = random.nextGaussian() * 0.3
    this.ya = random.nextGaussian() * 0.2
    this.za = random.nextFloat() * 0.7 + 1

    this.lifeTime = 60 * 10 + random.nextInt(60)

    this.walkDist = 0
    this.dir = 0
    this.hurtTime = 0
    this.xKnockback = 0
    this.yKnockback = 0
    this.time = 0
  }

  tick() {
    this.time++
    if (this.time >= this.lifeTime) {
      this.remove()
      return
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
    const ox = this.x
    const oy = this.y
    const nx = Math.round(this.xx)
    const ny = Math.round(this.yy)
    const expectedx = nx - this.x
    const expectedy = ny - this.y
    this.move(nx - this.x, ny - this.y)
    const gotx = this.x - ox
    const goty = this.y - oy
    this.xx += gotx - expectedx
    this.yy += goty - expectedy

    if (this.hurtTime > 0) this.hurtTime--
  }

  isBlockableBy(mob) {
    return false
  }

  render(screen) {
    if (this.time >= this.lifeTime - 6 * 20) {
      if ((this.time / 6 % 2 | 0) == 0) return
    }
    screen.render(this.x - 4, this.y - 4, this.item.getSprite(), Color.get(-1, 0, 0, 0), 0)
    screen.render(this.x - 4, this.y - 4 - Math.round(this.zz), this.item.getSprite(), this.item.getColor(), 0)
  }

  touchedBy(entity) {
    if (this.time > 30) entity.touchItem(this)
  }

  take(player) {
    Sound.pickup.play()
    player.score++
    this.item.onTake(this)
    this.remove()
  }
}




// public class ItemEntity extends Entity {
//  private int lifeTime;
//  protected int walkDist = 0;
//  protected int dir = 0;
//  public int hurtTime = 0;
//  protected int xKnockback, yKnockback;
//  public double xa, ya, za;
//  public double xx, yy, zz;
//  public Item item;
//  private int time = 0;

//  public ItemEntity(Item item, int x, int y) {
//    this.item = item;
//    xx = this.x = x;
//    yy = this.y = y;
//    xr = 3;
//    yr = 3;

//    zz = 2;
//    xa = random.nextGaussian() * 0.3;
//    ya = random.nextGaussian() * 0.2;
//    za = random.nextFloat() * 0.7 + 1;

//    lifeTime = 60 * 10 + random.nextInt(60);
//  }

//  public void tick() {
//    time++;
//    if (time >= lifeTime) {
//      remove();
//      return;
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
//    int ox = x;
//    int oy = y;
//    int nx = (int) xx;
//    int ny = (int) yy;
//    int expectedx = nx - x;
//    int expectedy = ny - y;
//    move(nx - x, ny - y);
//    int gotx = x - ox;
//    int goty = y - oy;
//    xx += gotx - expectedx;
//    yy += goty - expectedy;

//    if (hurtTime > 0) hurtTime--;
//  }

//  public boolean isBlockableBy(Mob mob) {
//    return false;
//  }

//  public void render(Screen screen) {
//    if (time >= lifeTime - 6 * 20) {
//      if (time / 6 % 2 == 0) return;
//    }
//    screen.render(x - 4, y - 4, item.getSprite(), Color.get(-1, 0, 0, 0), 0);
//    screen.render(x - 4, y - 4 - (int) (zz), item.getSprite(), item.getColor(), 0);
//  }

//  protected void touchedBy(Entity entity) {
//    if (time > 30) entity.touchItem(this);
//  }

//  public void take(Player player) {
//    Sound.pickup.play();
//    player.score++;
//    item.onTake(this);
//    remove();
//  }
// }

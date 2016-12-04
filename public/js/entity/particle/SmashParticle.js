// package com.mojang.ld22.entity.particle;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.sound.Sound;

class SmashParticle extends Entity {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
    Sound.monsterHurt.play()

    this.time = 0
  }

  tick() {
    this.time++
    if (this.time > 15) {
      this.remove()
    }
  }

  render(screen) {
    const col = Color.get(-1, 555, 555, 555)
    screen.render(this.x - 8, this.y - 8, 5 + 12 * 32, col, 2)
    screen.render(this.x - 0, this.y - 8, 5 + 12 * 32, col, 3)
    screen.render(this.x - 8, this.y - 0, 5 + 12 * 32, col, 0)
    screen.render(this.x - 0, this.y - 0, 5 + 12 * 32, col, 1)
  }
}



// public class SmashParticle extends Entity {
//  private int time = 0;

//  public SmashParticle(int x, int y) {
//    this.x = x;
//    this.y = y;
//    Sound.monsterHurt.play();
//  }

//  public void tick() {
//    time++;
//    if (time > 10) {
//      remove();
//    }
//  }

//  public void render(Screen screen) {
//    int col = Color.get(-1, 555, 555, 555);
//    screen.render(x - 8, y - 8, 5 + 12 * 32, col, 2);
//    screen.render(x - 0, y - 8, 5 + 12 * 32, col, 3);
//    screen.render(x - 8, y - 0, 5 + 12 * 32, col, 0);
//    screen.render(x - 0, y - 0, 5 + 12 * 32, col, 1);
//  }
// }

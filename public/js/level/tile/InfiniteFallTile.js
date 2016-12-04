// package com.mojang.ld22.level.tile;

// import com.mojang.ld22.entity.AirWizard;
// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;


class InfiniteFallTile extends Tile {
  constructor(id) {
    super(id)
  }

  render(screen, level, x, y) {}
  tick(level, xt, yt) {}

  mayPass(level, x, y, e) {
    if (e instanceof AirWizard) return true
    return false
  }
}


// public class InfiniteFallTile extends Tile {
//  public InfiniteFallTile(int id) {
//    super(id);
//  }

//  public void render(Screen screen, Level level, int x, int y) {
//  }

//  public void tick(Level level, int xt, int yt) {
//  }

//  public boolean mayPass(Level level, int x, int y, Entity e) {
//    if (e instanceof AirWizard) return true;
//    return false;
//  }
// }

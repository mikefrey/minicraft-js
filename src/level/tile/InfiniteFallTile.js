// package com.mojang.ld22.level.tile;

// import com.mojang.ld22.entity.AirWizard;
// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;


function InfiniteFallTile(id) {
  InfiniteFallTile.Super.init.call(this, id);
}

InfiniteFallTile.Super = Tile.prototype;
InfiniteFallTile.prototype = extend({}, new Tile(), {

  render: function(screen, level, x, y) {},

  tick: function(level, xt, yt) {},

  mayPass: function(level, x, y, e) {
    if (e instanceof AirWizard) return true;
    return false;
  }

});


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
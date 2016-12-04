

class SaplingTile extends Tile {

  constructor(id, onType, growsTo) {
    super(id)
    this.onType = onType
    this.growsTo = growsTo
    this.connectsToSand = onType.connectsToSand
    this.connectsToGrass = onType.connectsToGrass
    this.connectsToWater = onType.connectsToWater
    this.connectsToLava = onType.connectsToLava
  }

  render(screen, level, x, y) {
    onType.render(screen, level, x, y)
    const col = Color.get(10, 40, 50, -1)
    screen.render(x * 16 + 4, y * 16 + 4, 11 + 3 * 32, col, 0)
  }

  tick(level, x, y) {
    const age = level.getData(x, y) + 1
    if (age > 100) {
      level.setTile(x, y, growsTo, 0)
    } else {
      level.setData(x, y, age)
    }
  }

  hurt(level, x, y, source, dmg, attackDir) {
    level.setTile(x, y, onType, 0)
  }
}



// package com.mojang.ld22.level.tile;
//
// import com.mojang.ld22.entity.Mob;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;
//
// public class SaplingTile extends Tile {
// 	private Tile onType;
// 	private Tile growsTo;
//
// 	public SaplingTile(int id, Tile onType, Tile growsTo) {
// 		super(id);
// 		this.onType = onType;
// 		this.growsTo = growsTo;
// 		connectsToSand = onType.connectsToSand;
// 		connectsToGrass = onType.connectsToGrass;
// 		connectsToWater = onType.connectsToWater;
// 		connectsToLava = onType.connectsToLava;
// 	}
//
// 	public void render(Screen screen, Level level, int x, int y) {
// 		onType.render(screen, level, x, y);
// 		int col = Color.get(10, 40, 50, -1);
// 		screen.render(x * 16 + 4, y * 16 + 4, 11 + 3 * 32, col, 0);
// 	}
//
// 	public void tick(Level level, int x, int y) {
// 		int age = level.getData(x, y) + 1;
// 		if (age > 100) {
// 			level.setTile(x, y, growsTo, 0);
// 		} else {
// 			level.setData(x, y, age);
// 		}
// 	}
//
// 	public void hurt(Level level, int x, int y, Mob source, int dmg, int attackDir) {
// 		level.setTile(x, y, onType, 0);
// 	}
// }

// package com.mojang.ld22.entity;

// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.FurnitureItem;
// import com.mojang.ld22.item.PowerGloveItem;


class Furniture extends Entity {
  constructor(name) {
    super()
    this.name = name;
    this.xr = 3;
    this.yr = 3;

    this.pushTime = 0;
    this.pushDir = -1;
    this.col = 0;
    this.sprite = 0;
    this.shouldTake = null; /* Player */
  }

  // Furniture.Super = Entity.prototype;
  // Furniture.prototype = extend(new Entity(), {
  tick() {
    if (this.shouldTake != null) {
      if (this.shouldTake.activeItem instanceof PowerGloveItem) {
        this.remove();
        this.shouldTake.inventory.add(0, this.shouldTake.activeItem);
        this.shouldTake.activeItem = new FurnitureItem(this);
      }
      this.shouldTake = null;
    }
    if (this.pushDir == 0) this.move(0, +1);
    if (this.pushDir == 1) this.move(0, -1);
    if (this.pushDir == 2) this.move(-1, 0);
    if (this.pushDir == 3) this.move(+1, 0);
    this.pushDir = -1;
    if (this.pushTime > 0) this.pushTime--;
  }

  render(screen) {
    screen.render(this.x - 8, this.y - 8 - 4, this.sprite * 2 + 8 * 32, this.col, 0);
    screen.render(this.x - 0, this.y - 8 - 4, this.sprite * 2 + 8 * 32 + 1, this.col, 0);
    screen.render(this.x - 8, this.y - 0 - 4, this.sprite * 2 + 8 * 32 + 32, this.col, 0);
    screen.render(this.x - 0, this.y - 0 - 4, this.sprite * 2 + 8 * 32 + 33, this.col, 0);
  }

  blocks(e) {
    return true;
  }

  touchedBy(entity) {
    if (entity instanceof Player && this.pushTime == 0) {
      this.pushDir = entity.dir;
      this.pushTime = 10;
    }
  }

  take(player) {
    this.shouldTake = player;
  }
}


// public class Furniture extends Entity {
//  private int pushTime = 0;
//  private int pushDir = -1;
//  public int col, sprite;
//  public String name;
//  private Player shouldTake;

//  public Furniture(String name) {
//    this.name = name;
//    xr = 3;
//    yr = 3;
//  }

//  public void tick() {
//    if (shouldTake != null) {
//      if (shouldTake.activeItem instanceof PowerGloveItem) {
//        remove();
//        shouldTake.inventory.add(0, shouldTake.activeItem);
//        shouldTake.activeItem = new FurnitureItem(this);
//      }
//      shouldTake = null;
//    }
//    if (pushDir == 0) move(0, +1);
//    if (pushDir == 1) move(0, -1);
//    if (pushDir == 2) move(-1, 0);
//    if (pushDir == 3) move(+1, 0);
//    pushDir = -1;
//    if (pushTime > 0) pushTime--;
//  }

//  public void render(Screen screen) {
//    screen.render(x - 8, y - 8 - 4, sprite * 2 + 8 * 32, col, 0);
//    screen.render(x - 0, y - 8 - 4, sprite * 2 + 8 * 32 + 1, col, 0);
//    screen.render(x - 8, y - 0 - 4, sprite * 2 + 8 * 32 + 32, col, 0);
//    screen.render(x - 0, y - 0 - 4, sprite * 2 + 8 * 32 + 33, col, 0);
//  }

//  public boolean blocks(Entity e) {
//    return true;
//  }

//  protected void touchedBy(Entity entity) {
//    if (entity instanceof Player && pushTime == 0) {
//      pushDir = ((Player) entity).dir;
//      pushTime = 10;
//    }
//  }

//  public void take(Player player) {
//    shouldTake = player;
//  }
// }

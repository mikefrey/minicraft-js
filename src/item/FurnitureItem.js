// package com.mojang.ld22.item;

// import com.mojang.ld22.entity.Furniture;
// import com.mojang.ld22.entity.ItemEntity;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;

function FurnitureItem(furniture) {
  this.furniture = furniture;
  this.placed = false;
}

FurnitureItem.Super = Item.prototype;
FurnitureItem.prototype = extend({}, new Item(), {

  getColor: function() {
    return furniture.col;
  },

  getSprite: function() {
    return furniture.sprite + 10 * 32;
  },

  renderIcon: function(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
  },

  renderInventory: function(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
    Font.draw(this.furniture.name, screen, x + 8, y, Color.get(-1, 555, 555, 555));
  },

  onTake: function(itemEntity) { },

  canAttack: function() {
    return false;
  },

  interactOn: function(tile, level, xt, yt, player, attackDir) {
    if (tile.mayPass(level, xt, yt, this.furniture)) {
      this.furniture.x = xt * 16 + 8;
      this.furniture.y = yt * 16 + 8;
      level.add(furniture);
      this.placed = true;
      return true;
    }
    return false;
  },

  isDepleted: function() {
    return this.placed;
  },

  getName: function() {
    return this.furniture.name;
  }

});



// public class FurnitureItem extends Item {
//  public Furniture furniture;
//  public boolean placed = false;

//  public FurnitureItem(Furniture furniture) {
//    this.furniture = furniture;
//  }

//  public int getColor() {
//    return furniture.col;
//  }

//  public int getSprite() {
//    return furniture.sprite + 10 * 32;
//  }

//  public void renderIcon(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//  }

//  public void renderInventory(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//    Font.draw(furniture.name, screen, x + 8, y, Color.get(-1, 555, 555, 555));
//  }

//  public void onTake(ItemEntity itemEntity) {
//  }

//  public boolean canAttack() {
//    return false;
//  }

//  public boolean interactOn(Tile tile, Level level, int xt, int yt, Player player, int attackDir) {
//    if (tile.mayPass(level, xt, yt, furniture)) {
//      furniture.x = xt * 16 + 8;
//      furniture.y = yt * 16 + 8;
//      level.add(furniture);
//      placed = true;
//      return true;
//    }
//    return false;
//  }

//  public boolean isDepleted() {
//    return placed;
//  }

//  public String getName() {
//    return furniture.name;
//  }
// }
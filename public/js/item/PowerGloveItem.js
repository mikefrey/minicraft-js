// package com.mojang.ld22.item;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.entity.Furniture;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;


function PowerGloveItem() {

}

PowerGloveItem.Super = Item.prototype;
PowerGloveItem.prototype = extend(new Item(), {

  getColor: function() {
    return Color.get(-1, 100, 320, 430);
  },

  getSprite: function() {
    return 7 + 4 * 32;
  },

  renderIcon: function(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
  },

  renderInventory: function(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0);
    Font.draw(this.getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555));
  },

  getName: function() {
    return "Pow glove";
  },

  interact: function(player, entity, attackDir) {
    if (entity instanceof Furniture) {
      entity.take(player);
      return true;
    }
    return false;
  }

});



// public class PowerGloveItem extends Item {
//  public int getColor() {
//    return Color.get(-1, 100, 320, 430);
//  }

//  public int getSprite() {
//    return 7 + 4 * 32;
//  }

//  public void renderIcon(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//  }

//  public void renderInventory(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//    Font.draw(getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555));
//  }

//  public String getName() {
//    return "Pow glove";
//  }

//  public boolean interact(Player player, Entity entity, int attackDir) {
//    if (entity instanceof Furniture) {
//      Furniture f = (Furniture) entity;
//      f.take(player);
//      return true;
//    }
//    return false;
//  }
// }
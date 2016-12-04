// package com.mojang.ld22.item;

// import java.util.Random;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.entity.ItemEntity;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;

class ToolItem extends Item {
  
  constructor(type, level) {
    super()
    this.type = type
    this.level = level
  }

  getColor() {
    return ToolItem.LEVEL_COLORS[this.level]
  }

  getSprite() {
    return this.type.sprite + 5 * 32
  }

  getName() {
    return `${ToolItem.LEVEL_NAMES[this.level]} ${this.type.name}`
  }

  renderIcon(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0)
  }

  renderInventory(screen, x, y) {
    screen.render(x, y, this.getSprite(), this.getColor(), 0)
    Font.draw(this.getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555))
  }

  onTake(itemEntity) { }

  canAttack() {
    return true
  }

  getAttackDamageBonus(e) {
    if (this.type == ToolType.axe) {
      return (this.level + 1) * 2 + random.nextInt(4)
    }
    if (this.type == ToolType.sword) {
      return (this.level + 1) * 3 + random.nextInt(2 + this.level * this.level * 2)
    }
    return 1
  }

  matches(item) {
    if (item instanceof ToolItem) {
      if (item.type != this.type) return false
      if (item.level != this.level) return false
      return true
    }
    return false
  }
}

ToolItem.MAX_LEVEL = 5
ToolItem.LEVEL_NAMES = [ 'Wood', 'Rock', 'Iron', 'Gold', 'Gem' ]
ToolItem.LEVEL_COLORS = [
  Color.get(-1, 100, 321, 431),
  Color.get(-1, 100, 321, 111),
  Color.get(-1, 100, 321, 555),
  Color.get(-1, 100, 321, 550),
  Color.get(-1, 100, 321, 55)
]



// public class ToolItem extends Item {
//  private Random random = new Random();

//  public static final int MAX_LEVEL = 5;
//  public static final String[] LEVEL_NAMES = { //
//  "Wood", "Rock", "Iron", "Gold", "Gem"//
//  };

//  public static final int[] LEVEL_COLORS = {//
//  Color.get(-1, 100, 321, 431),//
//      Color.get(-1, 100, 321, 111),//
//      Color.get(-1, 100, 321, 555),//
//      Color.get(-1, 100, 321, 550),//
//      Color.get(-1, 100, 321, 055),//
//  };

//  public ToolType type;
//  public int level = 0;

//  public ToolItem(ToolType type, int level) {
//    this.type = type;
//    this.level = level;
//  }

//  public int getColor() {
//    return LEVEL_COLORS[level];
//  }

//  public int getSprite() {
//    return type.sprite + 5 * 32;
//  }

//  public void renderIcon(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//  }

//  public void renderInventory(Screen screen, int x, int y) {
//    screen.render(x, y, getSprite(), getColor(), 0);
//    Font.draw(getName(), screen, x + 8, y, Color.get(-1, 555, 555, 555));
//  }

//  public String getName() {
//    return LEVEL_NAMES[level] + " " + type.name;
//  }

//  public void onTake(ItemEntity itemEntity) {
//  }

//  public boolean canAttack() {
//    return true;
//  }

//  public int getAttackDamageBonus(Entity e) {
//    if (type == ToolType.axe) {
//      return (level + 1) * 2 + random.nextInt(4);
//    }
//    if (type == ToolType.sword) {
//      return (level + 1) * 3 + random.nextInt(2 + level * level * 2);
//    }
//    return 1;
//  }

//  public boolean matches(Item item) {
//    if (item instanceof ToolItem) {
//      ToolItem other = (ToolItem) item;
//      if (other.type != type) return false;
//      if (other.level != level) return false;
//      return true;
//    }
//    return false;
//  }
// }

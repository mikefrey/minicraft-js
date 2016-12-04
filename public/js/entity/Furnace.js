// package com.mojang.ld22.entity;

// import com.mojang.ld22.crafting.Crafting;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.screen.CraftingMenu;

class Furnace extends Furniture {
  constructor() {
    super('Furnace')
    this.col = Color.get(-1, 0, 222, 333)
    this.sprite = 3
    this.xr = 3
    this.yr = 2
  }

  use(player, attackDir) {
    player.game.setMenu(new CraftingMenu(Crafting.furnaceRecipes, player))
    return true
  }
}

// public class Furnace extends Furniture {
//  public Furnace() {
//    super("Furnace");
//    col = Color.get(-1, 000, 222, 333);
//    sprite = 3;
//    xr = 3;
//    yr = 2;
//  }

//  public boolean use(Player player, int attackDir) {
//    player.game.setMenu(new CraftingMenu(Crafting.furnaceRecipes, player));
//    return true;
//  }
// }

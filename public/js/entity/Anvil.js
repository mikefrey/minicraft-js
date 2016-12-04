// package com.mojang.ld22.entity;

// import com.mojang.ld22.crafting.Crafting;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.screen.CraftingMenu;

class Anvil extends Furniture {
  constructor() {
    super('Anvil')
    this.col = Color.get(-1, 0, 111, 222);
    this.sprite = 0;
    this.xr = 3;
    this.yr = 2;
  }

  use(player, attackDir) {
    player.game.setMenu(new CraftingMenu(Crafting.anvilRecipes, player));
    return true;
  }
}


// public class Anvil extends Furniture {
//  public Anvil() {
//    super("Anvil");
//    col = Color.get(-1, 000, 111, 222);
//    sprite = 0;
//    xr = 3;
//    yr = 2;
//  }

//  public boolean use(Player player, int attackDir) {
//    player.game.setMenu(new CraftingMenu(Crafting.anvilRecipes, player));
//    return true;
//  }
// }

// package com.mojang.ld22.entity;

// import com.mojang.ld22.crafting.Crafting;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.screen.CraftingMenu;

function Workbench() {
  this.col = Color.get(-1, 100, 321, 431);
  this.sprite = 4;
  this.xr = 3;
  this.yr = 2;
}

Workbench.prototype = new Furniture("Workbench");
Workbench.Super = Furniture.prototype;

Workbench.prototype.use = function(player, attackDir) {
  player.game.setMenu(new CraftingMenu(Crafting.workbenchRecipes, player));
  return true;
};


// public class Workbench extends Furniture {
//  public Workbench() {
//    super("Workbench");
//    col = Color.get(-1, 100, 321, 431);
//    sprite = 4;
//    xr = 3;
//    yr = 2;
//  }

//  public boolean use(Player player, int attackDir) {
//    player.game.setMenu(new CraftingMenu(Crafting.workbenchRecipes, player));
//    return true;
//  }
// }
// package com.mojang.ld22.entity;

// import com.mojang.ld22.crafting.Crafting;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.screen.CraftingMenu;

function Oven() {
  this.col = Color.get(-1, 0, 332, 442);
  this.sprite = 2;
  this.xr = 3;
  this.yr = 2;
}

Oven.prototype = new Furniture("Oven");
Oven.Super = Furniture.prototype;

Oven.prototype.use = function(player, attackDir) {
  player.game.setMenu(new CraftingMenu(Crafting.ovenRecipes, player));
  return true;
};


// public class Oven extends Furniture {
//  public Oven() {
//    super("Oven");
//    col = Color.get(-1, 000, 332, 442);
//    sprite = 2;
//    xr = 3;
//    yr = 2;
//  }

//  public boolean use(Player player, int attackDir) {
//    player.game.setMenu(new CraftingMenu(Crafting.ovenRecipes, player));
//    return true;
//  }
// }
// package com.mojang.ld22.crafting;

// import com.mojang.ld22.entity.Furniture;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.item.FurnitureItem;

function FurnitureRecipe(clazz) {
  this.init(new FurnitureItem(new clazz()));
  this.clazz = clazz;
}

FurnitureRecipe.Super = Recipe.prototype;
FurnitureRecipe.prototype = extend({}, new Recipe(), {

  craft: function(player) {
    player.inventory.add(0, new FurnitureItem(new clazz()));
  }

});


// public class FurnitureRecipe extends Recipe {
//  private Class<? extends Furniture> clazz;

//  public FurnitureRecipe(Class<? extends Furniture> clazz) throws InstantiationException, IllegalAccessException {
//    super(new FurnitureItem(clazz.newInstance()));
//    this.clazz = clazz;
//  }

//  public void craft(Player player) {
//    try {
//      player.inventory.add(0, new FurnitureItem(clazz.newInstance()));
//    } catch (Exception e) {
//      throw new RuntimeException(e);
//    }
//  }
// }

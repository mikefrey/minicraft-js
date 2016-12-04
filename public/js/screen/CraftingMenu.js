// package com.mojang.ld22.screen;

// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.Comparator;
// import java.util.List;

// import com.mojang.ld22.crafting.Recipe;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.Item;
// import com.mojang.ld22.item.ResourceItem;
// import com.mojang.ld22.sound.Sound;

class CraftingMenu extends Menu {

  constructor(recipes, player) {
    super()
    this.recipes = recipes
    this.player = player
    this.selected = 0

    for (let i = 0; i < recipes.length; i++) {
      this.recipes[i].checkCanCraft(player)
    }

    this.recipes = this.recipes.sort((r1, r2) => {
      if (r1.canCraft && !r2.canCraft) return -1
      if (!r1.canCraft && r2.canCraft) return 1
      return 0
    })
  }

  tick() {
    const input = this.input
    if (input.menu.clicked) this.game.setMenu(null)

    if (input.up.clicked) this.selected--
    if (input.down.clicked) this.selected++

    const len = this.recipes.length
    if (len == 0) this.selected = 0
    if (this.selected < 0) this.selected += len
    if (this.selected >= len) this.selected -= len

    if (input.attack.clicked && len > 0) {
      const r = this.recipes[this.selected]
      r.checkCanCraft(player)
      if (r.canCraft) {
        r.deductCost(player)
        r.craft(player)
        Sound.craft.play()
      }
      for (let i = 0; i < this.recipes.length; i++) {
        this.recipes[i].checkCanCraft(player)
      }
    }
  }

  render(screen) {
    Font.renderFrame(screen, 'Have', 12, 1, 19, 3)
    Font.renderFrame(screen, 'Cost', 12, 4, 19, 11)
    Font.renderFrame(screen, 'Crafting', 0, 1, 11, 11)
    this.renderItemList(screen, 0, 1, 11, 11, this.recipes, this.selected)

    if (this.recipes.length > 0) {
      const recipe = this.recipes[this.selected]
      const hasResultItems = this.player.inventory.count(recipe.resultTemplate)
      const xo = 13 * 8
      screen.render(xo, 2 * 8, recipe.resultTemplate.getSprite(), recipe.resultTemplate.getColor(), 0)
      Font.draw(`${hasResultItems}`, screen, xo + 8, 2 * 8, Color.get(-1, 555, 555, 555))

      const costs = recipe.costs
      for (let i = 0; i < costs.length; i++) {
        const item = costs[i]
        const yo = (5 + i) * 8
        screen.render(xo, yo, item.getSprite(), item.getColor(), 0)
        let requiredAmt = 1
        if (item instanceof ResourceItem) {
          requiredAmt = item.count
        }
        let has = this.player.inventory.count(item)
        let color = Color.get(-1, 555, 555, 555)
        if (has < requiredAmt) {
          color = Color.get(-1, 222, 222, 222)
        }
        if (has > 99) has = 99
        Font.draw(`${requiredAmt}/${has}`, screen, xo + 8, yo, color)
      }
    }
  }
}




// public class CraftingMenu extends Menu {
//  private Player player;
//  private int selected = 0;

//  private List<Recipe> recipes;

//  public CraftingMenu(List<Recipe> recipes, Player player) {
//    this.recipes = new ArrayList<Recipe>(recipes);
//    this.player = player;

//    for (int i = 0; i < recipes.size(); i++) {
//      this.recipes.get(i).checkCanCraft(player);
//    }

//    Collections.sort(this.recipes, new Comparator<Recipe>() {
//      public int compare(Recipe r1, Recipe r2) {
//        if (r1.canCraft && !r2.canCraft) return -1;
//        if (!r1.canCraft && r2.canCraft) return 1;
//        return 0;
//      }
//    });
//  }

//  public void tick() {
//    if (input.menu.clicked) game.setMenu(null);

//    if (input.up.clicked) selected--;
//    if (input.down.clicked) selected++;

//    int len = recipes.size();
//    if (len == 0) selected = 0;
//    if (selected < 0) selected += len;
//    if (selected >= len) selected -= len;

//    if (input.attack.clicked && len > 0) {
//      Recipe r = recipes.get(selected);
//      r.checkCanCraft(player);
//      if (r.canCraft) {
//        r.deductCost(player);
//        r.craft(player);
//        Sound.craft.play();
//      }
//      for (int i = 0; i < recipes.size(); i++) {
//        recipes.get(i).checkCanCraft(player);
//      }
//    }
//  }

//  public void render(Screen screen) {
//    Font.renderFrame(screen, "Have", 12, 1, 19, 3);
//    Font.renderFrame(screen, "Cost", 12, 4, 19, 11);
//    Font.renderFrame(screen, "Crafting", 0, 1, 11, 11);
//    renderItemList(screen, 0, 1, 11, 11, recipes, selected);

//    if (recipes.size() > 0) {
//      Recipe recipe = recipes.get(selected);
//      int hasResultItems = player.inventory.count(recipe.resultTemplate);
//      int xo = 13 * 8;
//      screen.render(xo, 2 * 8, recipe.resultTemplate.getSprite(), recipe.resultTemplate.getColor(), 0);
//      Font.draw("" + hasResultItems, screen, xo + 8, 2 * 8, Color.get(-1, 555, 555, 555));

//      List<Item> costs = recipe.costs;
//      for (int i = 0; i < costs.size(); i++) {
//        Item item = costs.get(i);
//        int yo = (5 + i) * 8;
//        screen.render(xo, yo, item.getSprite(), item.getColor(), 0);
//        int requiredAmt = 1;
//        if (item instanceof ResourceItem) {
//          requiredAmt = ((ResourceItem) item).count;
//        }
//        int has = player.inventory.count(item);
//        int color = Color.get(-1, 555, 555, 555);
//        if (has < requiredAmt) {
//          color = Color.get(-1, 222, 222, 222);
//        }
//        if (has > 99) has = 99;
//        Font.draw("" + requiredAmt + "/" + has, screen, xo + 8, yo, color);
//      }
//    }
//    // renderItemList(screen, 12, 4, 19, 11, recipes.get(selected).costs, -1);
//  }
// }

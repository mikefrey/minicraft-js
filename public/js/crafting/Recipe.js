// package com.mojang.ld22.crafting;

// import java.util.ArrayList;
// import java.util.List;

// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.Item;
// import com.mojang.ld22.item.ResourceItem;
// import com.mojang.ld22.item.resource.Resource;
// import com.mojang.ld22.screen.ListItem;

function Recipe() { }

Recipe.prototype = {

  init: function(resultTemplate) {
    this.costs = [];
    this.canCraft = false;
    this.resultTemlate = resultTemplate;
  },

  addCost: function(resource, count) {
    this.costs.push(new ResourceItem(resource, count));
    return this;
  },

  checkCanCraft: function(player) {
    for (var i = 0; i < costs.length; i++) {
      var item = costs[i];
      if (item instanceof ResourceItem) {
        var ri = item;
        if (!player.inventory.hasResources(ri.resource, ri.count)) {
          this.canCraft = false;
          return;
        }
      }
    }
    this.canCraft = true;
  },

  renderInventory: function(screen, x, y) {
    screen.render(x, y, this.resultTemlate.getSprite(), this.resultTemlate.getColor(), 0);
    var textColor = this.canCraft ? Color.get(-1, 555, 555, 555) : Color.get(-1, 222, 222, 222);
    Font.draw(this.resultTemlate.getName(), screen, x + 8, y, textColor);
  },

  craft: function(player) { },

  deductCost: function(player) {
    for (var i = 0; i < this.costs.length; i++) {
      var item = costs[i];
      if (item instanceof ResourceItem) {
        var ri = item;
        player.inventory.removeResource(ri.resource, ri.count);
      }
    }
  }

};



// public abstract class Recipe implements ListItem {
//  public List<Item> costs = new ArrayList<Item>();
//  public boolean canCraft = false;
//  public Item resultTemplate;

//  public Recipe(Item resultTemplate) {
//    this.resultTemplate = resultTemplate;
//  }

//  public Recipe addCost(Resource resource, int count) {
//    costs.add(new ResourceItem(resource, count));
//    return this;
//  }

//  public void checkCanCraft(Player player) {
//    for (int i = 0; i < costs.size(); i++) {
//      Item item = costs.get(i);
//      if (item instanceof ResourceItem) {
//        ResourceItem ri = (ResourceItem) item;
//        if (!player.inventory.hasResources(ri.resource, ri.count)) {
//          canCraft = false;
//          return;
//        }
//      }
//    }
//    canCraft = true;
//  }

//  public void renderInventory(Screen screen, int x, int y) {
//    screen.render(x, y, resultTemplate.getSprite(), resultTemplate.getColor(), 0);
//    int textColor = canCraft ? Color.get(-1, 555, 555, 555) : Color.get(-1, 222, 222, 222);
//    Font.draw(resultTemplate.getName(), screen, x + 8, y, textColor);
//  }

//  public abstract void craft(Player player);

//  public void deductCost(Player player) {
//    for (int i = 0; i < costs.size(); i++) {
//      Item item = costs.get(i);
//      if (item instanceof ResourceItem) {
//        ResourceItem ri = (ResourceItem) item;
//        player.inventory.removeResource(ri.resource, ri.count);
//      }
//    }
//  }
// }
// package com.mojang.ld22.screen;

// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.Item;

class InventoryMenu extends Menu {
  
  constructor(player) {
    super()
    this.player = player
    this.selected = 0

    if (player.activeItem != null) {
      player.inventory.items.unshift(player.activeItem)
      player.activeItem = null
    }
  }

  tick() {
    const input = this.input
    if (input.menu.clicked) game.setMenu(null)

    if (input.up.clicked) this.selected--
    if (input.down.clicked) this.selected++

    const len = this.player.inventory.items.length
    if (len == 0) this.selected = 0
    if (this.selected < 0) this.selected += len
    if (this.selected >= len) this.selected -= len

    if (input.attack.clicked && len > 0) {
      const item = this.player.inventory.items.remove(this.selected)
      this.player.activeItem = item
      this.game.setMenu(null)
    }
  }

  render(screen) {
    Font.renderFrame(screen, 'inventory', 1, 1, 12, 11)
    this.renderItemList(screen, 1, 1, 12, 11, this.player.inventory.items, this.selected)
  }
}




// public class InventoryMenu extends Menu {
//  private Player player;
//  private int selected = 0;

//  public InventoryMenu(Player player) {
//    this.player = player;

//    if (player.activeItem != null) {
//      player.inventory.items.add(0, player.activeItem);
//      player.activeItem = null;
//    }
//  }

//  public void tick() {
//    if (input.menu.clicked) game.setMenu(null);

//    if (input.up.clicked) selected--;
//    if (input.down.clicked) selected++;

//    int len = player.inventory.items.size();
//    if (len == 0) selected = 0;
//    if (selected < 0) selected += len;
//    if (selected >= len) selected -= len;

//    if (input.attack.clicked && len > 0) {
//      Item item = player.inventory.items.remove(selected);
//      player.activeItem = item;
//      game.setMenu(null);
//    }
//  }

//  public void render(Screen screen) {
//    Font.renderFrame(screen, "inventory", 1, 1, 12, 11);
//    renderItemList(screen, 1, 1, 12, 11, player.inventory.items, selected);
//  }
// }

// package com.mojang.ld22.screen;

// import com.mojang.ld22.entity.Inventory;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;

class ContainerMenu extends Menu {
  constructor(player, title, container) {
    super()
    this.player = player
    this.title = title
    this.container = container
    this.selected = 0
    this.window = 0
    this.oSelected = 0
  }

  tick() {
    const input = this.input
    let tmp
    if (input.menu.clicked) this.game.setMenu(null)

    if (input.left.clicked) {
      this.window = 0
      tmp = this.selected
      this.selected = this.oSelected
      this.oSelected = tmp
    }
    if (input.right.clicked) {
      window = 1
      tmp = this.selected
      this.selected = this.oSelected
      this.oSelected = tmp
    }

    const i = this.window == 1 ? this.player.inventory : container
    const i2 = this.window == 0 ? this.player.inventory : container

    const len = i.items.length
    if (this.selected < 0) this.selected = 0
    if (this.selected >= len) this.selected = len - 1

    if (input.up.clicked) this.selected--
    if (input.down.clicked) this.selected++

    if (len == 0) this.selected = 0
    if (this.selected < 0) this.selected += len
    if (this.selected >= len) this.selected -= len

    if (input.attack.clicked && len > 0) {
      i2.add(this.oSelected, i.items.remove(this.selected))
      if (this.selected >= i.items.length) this.selected = i.items.length - 1
    }
  }

  render(screen) {
    if (this.window == 1) screen.setOffset(6 * 8, 0)
    Font.renderFrame(screen, title, 1, 1, 12, 11)
    this.renderItemList(screen, 1, 1, 12, 11, this.container.items, this.window == 0 ? this.selected : -this.oSelected - 1)

    Font.renderFrame(screen, 'inventory', 13, 1, 13 + 11, 11)
    this.renderItemList(screen, 13, 1, 13 + 11, 11, this.player.inventory.items, this.window == 1 ? this.selected : -this.oSelected -1)
    screen.setOffset(0, 0)
  }
}


// public class ContainerMenu extends Menu {
//  private Player player;
//  private Inventory container;
//  private int selected = 0;
//  private String title;
//  private int oSelected;
//  private int window = 0;

//  public ContainerMenu(Player player, String title, Inventory container) {
//    this.player = player;
//    this.title = title;
//    this.container = container;
//  }

//  public void tick() {
//    if (input.menu.clicked) game.setMenu(null);

//    if (input.left.clicked) {
//      window = 0;
//      int tmp = selected;
//      selected = oSelected;
//      oSelected = tmp;
//    }
//    if (input.right.clicked) {
//      window = 1;
//      int tmp = selected;
//      selected = oSelected;
//      oSelected = tmp;
//    }

//    Inventory i = window == 1 ? player.inventory : container;
//    Inventory i2 = window == 0 ? player.inventory : container;

//    int len = i.items.size();
//    if (selected < 0) selected = 0;
//    if (selected >= len) selected = len - 1;

//    if (input.up.clicked) selected--;
//    if (input.down.clicked) selected++;

//    if (len == 0) selected = 0;
//    if (selected < 0) selected += len;
//    if (selected >= len) selected -= len;

//    if (input.attack.clicked && len > 0) {
//      i2.add(oSelected, i.items.remove(selected));
//      if (selected >= i.items.size()) selected = i.items.size() - 1;
//    }
//  }

//  public void render(Screen screen) {
//    if (window == 1) screen.setOffset(6 * 8, 0);
//    Font.renderFrame(screen, title, 1, 1, 12, 11);
//    renderItemList(screen, 1, 1, 12, 11, container.items, window == 0 ? selected : -oSelected - 1);

//    Font.renderFrame(screen, "inventory", 13, 1, 13 + 11, 11);
//    renderItemList(screen, 13, 1, 13 + 11, 11, player.inventory.items, window == 1 ? selected : -oSelected - 1);
//    screen.setOffset(0, 0);
//  }
// }

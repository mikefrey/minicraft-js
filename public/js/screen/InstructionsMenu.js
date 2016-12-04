// package com.mojang.ld22.screen;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;

class InstructionsMenu extends Menu {

  constructor(parent) {
    super()
    this.parent = parent
  }

  tick() {
    if (this.input.attack.clicked || this.input.menu.clicked) {
      this.game.setMenu(this.parent)
    }
  }

  render(screen) {
    screen.clear(0)

    const color = Color.get(0, 333, 333, 333)

    Font.draw("HOW TO PLAY",          screen, 4 * 8 + 4, 1 * 8, Color.get(0, 555, 555, 555))
    Font.draw("Move your character",  screen, 0 * 8 + 4, 3 * 8, color)
    Font.draw("with the arrow keys",  screen, 0 * 8 + 4, 4 * 8, color)
    Font.draw("press C to attack",    screen, 0 * 8 + 4, 5 * 8, color)
    Font.draw("and X to open the",    screen, 0 * 8 + 4, 6 * 8, color)
    Font.draw("inventory and to",     screen, 0 * 8 + 4, 7 * 8, color)
    Font.draw("use items.",           screen, 0 * 8 + 4, 8 * 8, color)
    Font.draw("Select an item in",    screen, 0 * 8 + 4, 9 * 8, color)
    Font.draw("the inventory to",     screen, 0 * 8 + 4, 10 * 8, color)
    Font.draw("equip it.",            screen, 0 * 8 + 4, 11 * 8, color)
    Font.draw("Kill the air wizard",  screen, 0 * 8 + 4, 12 * 8, color)
    Font.draw("to win the game!",     screen, 0 * 8 + 4, 13 * 8, color)
  }
}


// public class InstructionsMenu extends Menu {
//  private Menu parent;

//  public InstructionsMenu(Menu parent) {
//    this.parent = parent;
//  }

//  public void tick() {
//    if (input.attack.clicked || input.menu.clicked) {
//      game.setMenu(parent);
//    }
//  }

//  public void render(Screen screen) {
//    screen.clear(0);

//    Font.draw("HOW TO PLAY", screen, 4 * 8 + 4, 1 * 8, Color.get(0, 555, 555, 555));
//    Font.draw("Move your character", screen, 0 * 8 + 4, 3 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("with the arrow keys", screen, 0 * 8 + 4, 4 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("press C to attack", screen, 0 * 8 + 4, 5 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("and X to open the", screen, 0 * 8 + 4, 6 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("inventory and to", screen, 0 * 8 + 4, 7 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("use items.", screen, 0 * 8 + 4, 8 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("Select an item in", screen, 0 * 8 + 4, 9 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("the inventory to", screen, 0 * 8 + 4, 10 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("equip it.", screen, 0 * 8 + 4, 11 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("Kill the air wizard", screen, 0 * 8 + 4, 12 * 8, Color.get(0, 333, 333, 333));
//    Font.draw("to win the game!", screen, 0 * 8 + 4, 13 * 8, Color.get(0, 333, 333, 333));
//  }
// }

// package com.mojang.ld22.screen;

// import java.util.List;

// import com.mojang.ld22.Game;
// import com.mojang.ld22.InputHandler;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;

function Menu() {

}

Menu.prototype = {

  init: function(game, input) {
    this.input = input;
    this.game = game;
  },

  tick: function() { },

  render: function() { },

  renderItemList: function(screen, xo, yo, x1, y1, listItems, selected) {
    var renderCursor = true;
    if (selected < 0) {
      selected = -selected -1;
      renderCursor = false;
    }
    var w = x1 - xo;
    var h = y1 - yo - 1;
    var i0 = 0;
    var i1 = listItems.length;
    if (i1 > h) i1 = h;
    var io = selected - h / 2;
    if (io > listItems.length - h) io = listItems.length - h;
    if (io < 0) io = 0;

    for (var i = i0; i < i1; i++) {
      listItems[i+io].renderInventory(screen, (1 + xo) * 8, (i + 1 + yo) * 8);
    }

    if (renderCursor) {
      var yy = selected + 1 - io + yo;
      Font.draw('>', screen, (xo + 0) * 8, yy * 8, Color.get(5, 555, 555, 555));
      Font.draw('<', screen, (xo + w) * 8, yy * 8, Color.get(5, 555, 555, 555));
    }
  }

};




// public class Menu {
//   protected Game game;
//   protected InputHandler input;

//   public void init(Game game, InputHandler input) {
//     this.input = input;
//     this.game = game;
//   }

//   public void tick() {
//   }

//   public void render(Screen screen) {
//   }

//   public void renderItemList(Screen screen, int xo, int yo, int x1, int y1, List<? extends ListItem> listItems, int selected) {
//     boolean renderCursor = true;
//     if (selected < 0) {
//       selected = -selected - 1;
//       renderCursor = false;
//     }
//     int w = x1 - xo;
//     int h = y1 - yo - 1;
//     int i0 = 0;
//     int i1 = listItems.size();
//     if (i1 > h) i1 = h;
//     int io = selected - h / 2;
//     if (io > listItems.size() - h) io = listItems.size() - h;
//     if (io < 0) io = 0;

//     for (int i = i0; i < i1; i++) {
//       listItems.get(i + io).renderInventory(screen, (1 + xo) * 8, (i + 1 + yo) * 8);
//     }

//     if (renderCursor) {
//       int yy = selected + 1 - io + yo;
//       Font.draw(">", screen, (xo + 0) * 8, yy * 8, Color.get(5, 555, 555, 555));
//       Font.draw("<", screen, (xo + w) * 8, yy * 8, Color.get(5, 555, 555, 555));
//     }
//   }
// }

// package com.mojang.ld22;

// import java.awt.BorderLayout;
// import java.awt.Canvas;
// import java.awt.Dimension;
// import java.awt.Graphics;
// import java.awt.image.BufferStrategy;
// import java.awt.image.BufferedImage;
// import java.awt.image.DataBufferInt;
// import java.io.IOException;
// import java.util.Random;

// import javax.imageio.ImageIO;
// import javax.swing.JFrame;

// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.gfx.SpriteSheet;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;
// import com.mojang.ld22.screen.DeadMenu;
// import com.mojang.ld22.screen.LevelTransitionMenu;
// import com.mojang.ld22.screen.Menu;
// import com.mojang.ld22.screen.TitleMenu;
// import com.mojang.ld22.screen.WonMenu;



function Game(canvasID) {
  this.canvas = document.getElementById(canvasID);
  this.ctx = canvas.getContext('2d');

  this.image = null;
  this.pixels = [];
  this.running = false;
  this.screen = null;
  this.lightScreen = null;
  this.input = new InputHandler(this);

  this.colors = [];
  this.tickCount = 0;
  this.gameTime = 0;

  this.level = null;
  this.levels = [];
  this.currentLevel = 3;
  this.player = null;

  this.menu = null;
  this.playerDeadTime = 0;
  this.pendingLevelChange = 0;
  this.wonTimer = 0;
  this.hasWon = false;
}

extend(Game, {
  serialVersionUID: 1,
  NAME: 'Minicraft.js',
  HEIGHT: 120,
  WIDTH: 160,
  SCALE: 3
});

Game.prototype = {

  setMenu: function(menu) {
    this.menu = menu;
    if (menu) menu.init(this, this.input);
  },

  start: function() {
    this.running = true;
    setTimeout(this.run.bind(this), 15);
  },

  stop: function() {
    this.running = false;
  },

  resetGame: function() {
    this.playerDeadTime = 0;
    this.wonTimer = 0;
    this.gameTime = 0;
    this.hasWon = false;

    this.levels = [];
    this.currentLevel = 3;

    this.levels[4] = new Level(128, 128, 1, null);
    this.levels[3] = new Level(128, 128, 0, this.levels[4]);
    this.levels[2] = new Level(128, 128, -1, this.levels[3]);
    this.levels[1] = new Level(128, 128, -2, this.levels[2]);
    this.levels[0] = new Level(128, 128, -3, this.levels[1]);

    this.level = this.levels[this.currentLevel];
    this.player = new Player(this, this.input);
    this.player.findStartPos(this.level);

    this.level.add(this.player);

    for (var i = 0; i < 5; i++) {
      this.levels[i].trySpawn(5000);
    }
  },

  init: function() {
    var pp = 0;
    for (var r = 0; r < 6; r++) {
      for (var g = 0; g < 6; g++) {
        for (var b = 0; b < 6; b++) {
          var rr = r * 255 / 5;
          var gg = g * 255 / 5;
          var bb = b * 255 / 5;
          var mid = (rr * 30 + gg * 59 + bb * 11) / 100;

          var r1 = ((rr + mid * 1) / 2) * 230 / 255 + 10;
          var g1 = ((gg + mid * 1) / 2) * 230 / 255 + 10;
          var b1 = ((bb + mid * 1) / 2) * 230 / 255 + 10;
          this.colors[pp++] = r1 << 16 | g1 << 8 | b1;
        }
      }
    }

    //try {
      this.screen = new Screen(Game.WIDTH, Game.HEIGHT, new SpriteSheet(images.icons));
      this.lightScreen = new Screen(Game.WIDTH, Game.HEIGHT, new SpriteSheet(images.icons));
    //} catch (e) {
    //  console.log(e);
    //}

    this.resetGame();
    this.setMenu(new TitleMenu());
  },

  run: function() {
    var lastTime = +new Date;
    var unprocessed = 0;
    var msPerTick = 1000 / 60;
    var frames = 0;
    var ticks = 0;
    var lastTimer1 = +new Date;

    this.init();

    //while (this.running) {
    var loop = (function() {
      var now = +new Date;
      unprocessed += (now - lastTime) / msPerTick;
      lastTime = now;
      var shouldRender = true;
      while (unprocessed >= 1) {
        ticks++;
        this.tick();
        unprocessed -= 1;
        shouldRender = true;
      }

      if (shouldRender) {
        frames++;
        this.render();
      }

      if (+new Date - lastTimer1 > 1000)  {
        lastTimer1 += 1000;
        // TODO : Output FPS
        console.log(frames);
        frames = 0;
        ticks = 0;
      }

      setTimeout(loop, 10);
    }).bind(this);

    loop();
  },

  tick: function() {
    this.tickCount++;
    // if (!this.hasFocus()) {
    //  this.input.releaseAll();
    // } else {
    if (!this.player.removed && !this.hasWon) this.gameTime++;

    this.input.tick();
    if (this.menu != null) {
      this.menu.tick();
    } else {
      if (this.player.removed) {
        this.playerDeadTime++;
        if (this.playerDeadTime > 60) {
          this.setMenu(new DeadMenu());
        }
      } else {
        if (this.pendingLevelChange != 0) {
          this.setMenu(new LevelTransitionMenu(this.pendingLevelChange));
          this.pendingLevelChange = 0;
        }
      }
      if (this.wonTimer > 0) {
        if (--this.wonTimer == 0) {
          this.setMenu(new WonMenu());
        }
      }
      this.level.tick();
      Tile.tickCount++;
    }
    // }
  },

  changeLevel: function(dir) {
    this.level.remove(this.player);
    this.currentLevel += dir;
    this.level = this.levels[this.currentLevel];
    this.player.x = (this.player.x >> 4) * 16 + 8;
    this.player.y = (this.player.y >> 4) * 16 + 8;
    this.level.add(player);
  },

  render: function() {
    var screen = this.screen;
    var player = this.player;
    var xScroll = player.x - screen.w / 2;
    var yScroll = player.y - (screen.h - 8) / 2;

    var y, x;

    xScroll = Math.min(Math.max(xScroll, 16), this.level.w * 16 - screen.w - 16);
    yScroll = Math.min(Math.max(yScroll, 16), this.level.h * 16 - screen.h - 16);

    if (this.currentLevel > 3) {
      var col = Color.get(20, 20, 121, 121);
      for (y = 0; y < 14; y++) {
        for (x = 0; x < 24; x++) {
          screen.render(x * 8 - ((xScroll / 4) & 7), y * 8 - ((yScroll / 4) & 7), 0, col, 0);
        }
      }
    }

    this.level.renderBackground(screen, xScroll, yScroll);
    this.level.renderSprites(screen, xScroll, yScroll);

    if (this.currentLevel < 3) {
      this.lightScreen.clear(0);
      this.level.renderLight(this.lightScreen, xScroll, yScroll);
      screen.overlay(this.lightScreen, xScroll, yScroll);
    }

    this.renderGui();

    for (y = 0; y < screen.h; y++) {
      for (x = 0; x < screen.w; x++) {
        var cc = screen.pixels[x + y * screen.w];
        if (cc < 255) this.pixels[x + y * Game.WIDTH] = this.colors[cc];
      }
    }

    // TODO : setImageData on canvas
    // Graphics g = bs.getDrawGraphics();
    // g.fillRect(0, 0, getWidth(), getHeight());

    // int ww = WIDTH * 3;
    // int hh = HEIGHT * 3;
    // int xo = (getWidth() - ww) / 2;
    // int yo = (getHeight() - hh) / 2;
    // g.drawImage(image, xo, yo, ww, hh, null);
    // g.dispose();
    // bs.show();

    var ww = Game.WIDTH * Game.SCALE;
    var hh = Game.HEIGHT * Game.SCALE;
    var imgData = this.ctx.createImageData(ww, hh);
    var len = imgData.data.length;

    for (var i = 0; i < len; i+=3) {
      imgData.data[i+0] = this.pixels[i+0];
      imgData.data[i+1] = this.pixels[i+1];
      imgData.data[i+2] = this.pixels[i+2];
    }

    this.ctx.putImageData(imgData, 0, 0); //, ww, hh);
  },

  renderGui: function() {
    var screen = this.screen;
    for (var y = 0; y < 2; y++) {
      for (var x = 0; x < 2; x++) {
        screen.render(x * 8, screen.h - 16 + y * 8, 0 + 12 * 32, Color.get(0, 0, 0, 0), 0);
      }
    }

    for (var i = 0; i < 10; i++) {
      var color = Color.get(0, 100, 0, 0);
      if (i < this.player.health) {
        color = Color.get(0, 200, 500, 533);
      }
      screen.render(i * 8, screen.h - 16, 0 + 12 * 32, color, 0);

      color = Color.get(0, 110, 0, 0);
      if (this.player.staminaRechargeDelay > 0) {
        if (this.player.staminaRechargeDelay / 4 % 2 == 0)
          color = Color.get(0, 200, 500, 533);
      } else {
        if (i < this.player.stamina)
          color = Color.get(0, 220, 550, 553);
      }
      screen.render(i * 8, screen.h - 8, 1 + 12 * 32, color, 0);
    }

    if (this.player.activeItem != null) {
      this.player.activeItem.renderInventory(screen, 10 * 8, screen.h - 16);
    }

    if (this.menu != null) {
      this.menu.render(screen);
    }
  },

  scheduleLevelChange: function(dir) {
    this.pendingLevelChange = dir;
  },

  won: function() {
    this.wonTimer = 60 * 3;
    this.hasWon = true;
  }

};












// public class Game extends Canvas implements Runnable {
//  private static final long serialVersionUID = 1L;
//  private Random random = new Random();
//  public static final String NAME = "Minicraft";
//  public static final int HEIGHT = 120;
//  public static final int WIDTH = 160;
//  private static final int SCALE = 3;

//  private BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
//  private int[] pixels = ((DataBufferInt) image.getRaster().getDataBuffer()).getData();
//  private boolean running = false;
//  private Screen screen;
//  private Screen lightScreen;
//  private InputHandler input = new InputHandler(this);

//  private int[] colors = new int[256];
//  private int tickCount = 0;
//  public int gameTime = 0;

//  private Level level;
//  private Level[] levels = new Level[5];
//  private int currentLevel = 3;
//  public Player player;

//  public Menu menu;
//  private int playerDeadTime;
//  private int pendingLevelChange;
//  private int wonTimer = 0;
//  public boolean hasWon = false;

//  public void setMenu(Menu menu) {
//    this.menu = menu;
//    if (menu != null) menu.init(this, input);
//  }

//  public void start() {
//    running = true;
//    new Thread(this).start();
//  }

//  public void stop() {
//    running = false;
//  }

//  public void resetGame() {
//    playerDeadTime = 0;
//    wonTimer = 0;
//    gameTime = 0;
//    hasWon = false;

//    levels = new Level[5];
//    currentLevel = 3;

//    levels[4] = new Level(128, 128, 1, null);
//    levels[3] = new Level(128, 128, 0, levels[4]);
//    levels[2] = new Level(128, 128, -1, levels[3]);
//    levels[1] = new Level(128, 128, -2, levels[2]);
//    levels[0] = new Level(128, 128, -3, levels[1]);

//    level = levels[currentLevel];
//    player = new Player(this, input);
//    player.findStartPos(level);

//    level.add(player);

//    for (int i = 0; i < 5; i++) {
//      levels[i].trySpawn(5000);
//    }
//  }

//  private void init() {
//    int pp = 0;
//    for (int r = 0; r < 6; r++) {
//      for (int g = 0; g < 6; g++) {
//        for (int b = 0; b < 6; b++) {
//          int rr = (r * 255 / 5);
//          int gg = (g * 255 / 5);
//          int bb = (b * 255 / 5);
//          int mid = (rr * 30 + gg * 59 + bb * 11) / 100;

//          int r1 = ((rr + mid * 1) / 2) * 230 / 255 + 10;
//          int g1 = ((gg + mid * 1) / 2) * 230 / 255 + 10;
//          int b1 = ((bb + mid * 1) / 2) * 230 / 255 + 10;
//          colors[pp++] = r1 << 16 | g1 << 8 | b1;

//        }
//      }
//    }
//    try {
//      screen = new Screen(WIDTH, HEIGHT, new SpriteSheet(ImageIO.read(Game.class.getResourceAsStream("/icons.png"))));
//      lightScreen = new Screen(WIDTH, HEIGHT, new SpriteSheet(ImageIO.read(Game.class.getResourceAsStream("/icons.png"))));
//    } catch (IOException e) {
//      e.printStackTrace();
//    }

//    resetGame();
//    setMenu(new TitleMenu());
//  }

//  public void run() {
//    long lastTime = System.nanoTime();
//    double unprocessed = 0;
//    double nsPerTick = 1000000000.0 / 60;
//    int frames = 0;
//    int ticks = 0;
//    long lastTimer1 = System.currentTimeMillis();

//    init();

//    while (running) {
//      long now = System.nanoTime();
//      unprocessed += (now - lastTime) / nsPerTick;
//      lastTime = now;
//      boolean shouldRender = true;
//      while (unprocessed >= 1) {
//        ticks++;
//        tick();
//        unprocessed -= 1;
//        shouldRender = true;
//      }

//      try {
//        Thread.sleep(2);
//      } catch (InterruptedException e) {
//        e.printStackTrace();
//      }

//      if (shouldRender) {
//        frames++;
//        render();
//      }

//      if (System.currentTimeMillis() - lastTimer1 > 1000) {
//        lastTimer1 += 1000;
//        System.out.println(ticks + " ticks, " + frames + " fps");
//        frames = 0;
//        ticks = 0;
//      }
//    }
//  }

//  public void tick() {
//    tickCount++;
//    if (!hasFocus()) {
//      input.releaseAll();
//    } else {
//      if (!player.removed && !hasWon) gameTime++;

//      input.tick();
//      if (menu != null) {
//        menu.tick();
//      } else {
//        if (player.removed) {
//          playerDeadTime++;
//          if (playerDeadTime > 60) {
//            setMenu(new DeadMenu());
//          }
//        } else {
//          if (pendingLevelChange != 0) {
//            setMenu(new LevelTransitionMenu(pendingLevelChange));
//            pendingLevelChange = 0;
//          }
//        }
//        if (wonTimer > 0) {
//          if (--wonTimer == 0) {
//            setMenu(new WonMenu());
//          }
//        }
//        level.tick();
//        Tile.tickCount++;
//      }
//    }
//  }

//  public void changeLevel(int dir) {
//    level.remove(player);
//    currentLevel += dir;
//    level = levels[currentLevel];
//    player.x = (player.x >> 4) * 16 + 8;
//    player.y = (player.y >> 4) * 16 + 8;
//    level.add(player);

//  }

//  public void render() {
//    BufferStrategy bs = getBufferStrategy();
//    if (bs == null) {
//      createBufferStrategy(3);
//      requestFocus();
//      return;
//    }

//    int xScroll = player.x - screen.w / 2;
//    int yScroll = player.y - (screen.h - 8) / 2;
//    if (xScroll < 16) xScroll = 16;
//    if (yScroll < 16) yScroll = 16;
//    if (xScroll > level.w * 16 - screen.w - 16) xScroll = level.w * 16 - screen.w - 16;
//    if (yScroll > level.h * 16 - screen.h - 16) yScroll = level.h * 16 - screen.h - 16;
//    if (currentLevel > 3) {
//      int col = Color.get(20, 20, 121, 121);
//      for (int y = 0; y < 14; y++)
//        for (int x = 0; x < 24; x++) {
//          screen.render(x * 8 - ((xScroll / 4) & 7), y * 8 - ((yScroll / 4) & 7), 0, col, 0);
//        }
//    }

//    level.renderBackground(screen, xScroll, yScroll);
//    level.renderSprites(screen, xScroll, yScroll);

//    if (currentLevel < 3) {
//      lightScreen.clear(0);
//      level.renderLight(lightScreen, xScroll, yScroll);
//      screen.overlay(lightScreen, xScroll, yScroll);
//    }

//    renderGui();

//    if (!hasFocus()) renderFocusNagger();

//    for (int y = 0; y < screen.h; y++) {
//      for (int x = 0; x < screen.w; x++) {
//        int cc = screen.pixels[x + y * screen.w];
//        if (cc < 255) pixels[x + y * WIDTH] = colors[cc];
//      }
//    }

//    Graphics g = bs.getDrawGraphics();
//    g.fillRect(0, 0, getWidth(), getHeight());

//    int ww = WIDTH * 3;
//    int hh = HEIGHT * 3;
//    int xo = (getWidth() - ww) / 2;
//    int yo = (getHeight() - hh) / 2;
//    g.drawImage(image, xo, yo, ww, hh, null);
//    g.dispose();
//    bs.show();
//  }

//  private void renderGui() {
//    for (int y = 0; y < 2; y++) {
//      for (int x = 0; x < 20; x++) {
//        screen.render(x * 8, screen.h - 16 + y * 8, 0 + 12 * 32, Color.get(000, 000, 000, 000), 0);
//      }
//    }

//    for (int i = 0; i < 10; i++) {
//      if (i < player.health)
//        screen.render(i * 8, screen.h - 16, 0 + 12 * 32, Color.get(000, 200, 500, 533), 0);
//      else
//        screen.render(i * 8, screen.h - 16, 0 + 12 * 32, Color.get(000, 100, 000, 000), 0);

//      if (player.staminaRechargeDelay > 0) {
//        if (player.staminaRechargeDelay / 4 % 2 == 0)
//          screen.render(i * 8, screen.h - 8, 1 + 12 * 32, Color.get(000, 555, 000, 000), 0);
//        else
//          screen.render(i * 8, screen.h - 8, 1 + 12 * 32, Color.get(000, 110, 000, 000), 0);
//      } else {
//        if (i < player.stamina)
//          screen.render(i * 8, screen.h - 8, 1 + 12 * 32, Color.get(000, 220, 550, 553), 0);
//        else
//          screen.render(i * 8, screen.h - 8, 1 + 12 * 32, Color.get(000, 110, 000, 000), 0);
//      }
//    }
//    if (player.activeItem != null) {
//      player.activeItem.renderInventory(screen, 10 * 8, screen.h - 16);
//    }

//    if (menu != null) {
//      menu.render(screen);
//    }
//  }

//  private void renderFocusNagger() {
//    String msg = "Click to focus!";
//    int xx = (WIDTH - msg.length() * 8) / 2;
//    int yy = (HEIGHT - 8) / 2;
//    int w = msg.length();
//    int h = 1;

//    screen.render(xx - 8, yy - 8, 0 + 13 * 32, Color.get(-1, 1, 5, 445), 0);
//    screen.render(xx + w * 8, yy - 8, 0 + 13 * 32, Color.get(-1, 1, 5, 445), 1);
//    screen.render(xx - 8, yy + 8, 0 + 13 * 32, Color.get(-1, 1, 5, 445), 2);
//    screen.render(xx + w * 8, yy + 8, 0 + 13 * 32, Color.get(-1, 1, 5, 445), 3);
//    for (int x = 0; x < w; x++) {
//      screen.render(xx + x * 8, yy - 8, 1 + 13 * 32, Color.get(-1, 1, 5, 445), 0);
//      screen.render(xx + x * 8, yy + 8, 1 + 13 * 32, Color.get(-1, 1, 5, 445), 2);
//    }
//    for (int y = 0; y < h; y++) {
//      screen.render(xx - 8, yy + y * 8, 2 + 13 * 32, Color.get(-1, 1, 5, 445), 0);
//      screen.render(xx + w * 8, yy + y * 8, 2 + 13 * 32, Color.get(-1, 1, 5, 445), 1);
//    }

//    if ((tickCount / 20) % 2 == 0) {
//      Font.draw(msg, screen, xx, yy, Color.get(5, 333, 333, 333));
//    } else {
//      Font.draw(msg, screen, xx, yy, Color.get(5, 555, 555, 555));
//    }
//  }

//  public void scheduleLevelChange(int dir) {
//    pendingLevelChange = dir;
//  }

//  public static void main(String[] args) {
//    Game game = new Game();
//    game.setMinimumSize(new Dimension(WIDTH * SCALE, HEIGHT * SCALE));
//    game.setMaximumSize(new Dimension(WIDTH * SCALE, HEIGHT * SCALE));
//    game.setPreferredSize(new Dimension(WIDTH * SCALE, HEIGHT * SCALE));

//    JFrame frame = new JFrame(Game.NAME);
//    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//    frame.setLayout(new BorderLayout());
//    frame.add(game, BorderLayout.CENTER);
//    frame.pack();
//    frame.setResizable(false);
//    frame.setLocationRelativeTo(null);
//    frame.setVisible(true);

//    game.start();
//  }

//  public void won() {
//    wonTimer = 60 * 3;
//    hasWon = true;
//  }
// }
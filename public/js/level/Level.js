// package com.mojang.ld22.level;

// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.Comparator;
// import java.util.List;
// import java.util.Random;

// import com.mojang.ld22.entity.AirWizard;
// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.entity.Mob;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.entity.Slime;
// import com.mojang.ld22.entity.Zombie;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.levelgen.LevelGen;
// import com.mojang.ld22.level.tile.Tile;

class Level {
  constructor(w, h, level, parentLevel) {

    this.player = null;
    this.rowSprites = [];

    // this.w = 0;
    // this.h = 0;
    // this.tiles = [];
    // this.data = [];
    this.entitiesInTiles = [];

    this.grassColor = 141;
    this.dirtColor = 322;
    this.sandColor = 550;
    // this.depth = 0;
    this.monsterDensity = 8;

    this.entities = [];

    this.depth = level;
    this.w = w;
    this.h = h;
    let maps;

    if (level < 0) {
      this.dirtColor = 222;
    }
    else if (level == 1) {
      this.dirtColor = 444;
    }

    if (level == 0) {
      maps = LevelGen.createAndValidateTopMap(w, h);
    } else if (level < 0) {
      maps = LevelGen.createAndValidateUndergroundMap(w, h, -level);
      this.monsterDensity = 4;
    } else {
      maps = LevelGen.createAndValidateSkyMap(w, h);
      this.monsterDensity = 4;
    }

    this.tiles = maps[0];
    this.data = maps[1];

    if (parentLevel != null) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (parentLevel.getTile(x, y) == Tile.stairsDown) {
            this.setTile(x, y, Tile.stairsUp, 0);
            if (level == 0) {
              this.setTile(x - 1, y, Tile.hardRock, 0);
              this.setTile(x + 1, y, Tile.hardRock, 0);
              this.setTile(x, y - 1, Tile.hardRock, 0);
              this.setTile(x, y + 1, Tile.hardRock, 0);
              this.setTile(x - 1, y - 1, Tile.hardRock, 0);
              this.setTile(x - 1, y + 1, Tile.hardRock, 0);
              this.setTile(x + 1, y - 1, Tile.hardRock, 0);
              this.setTile(x + 1, y + 1, Tile.hardRock, 0);
            } else {
              this.setTile(x - 1, y, Tile.dirt, 0);
              this.setTile(x + 1, y, Tile.dirt, 0);
              this.setTile(x, y - 1, Tile.dirt, 0);
              this.setTile(x, y + 1, Tile.dirt, 0);
              this.setTile(x - 1, y - 1, Tile.dirt, 0);
              this.setTile(x - 1, y + 1, Tile.dirt, 0);
              this.setTile(x + 1, y - 1, Tile.dirt, 0);
              this.setTile(x + 1, y + 1, Tile.dirt, 0);
            }
          }
        }
      }
    }

    for (let i = 0; i < w * h; i++) {
      this.entitiesInTiles[i] = [];
    }

    if (level == 1) {
      const aw = new AirWizard();
      aw.x = w * 8;
      aw.y = h * 8;
      this.add(aw);
    }
  }

  spriteSorter(e0, e1) {
    return e0.y - e1.y
  }

  renderBackground(screen, xScroll, yScroll) {
    const xo = xScroll >> 4;
    const yo = yScroll >> 4;
    const w = (screen.w + 15) >> 4;
    const h = (screen.h + 15) >> 4;
    screen.setOffset(xScroll, yScroll);
    for (let y = yo; y <= h + yo; y++) {
      for (let x = xo; x <= w + xo; x++) {
        this.getTile(x, y).render(screen, this, x, y);
      }
    }
    screen.setOffset(0, 0);
  }

  renderSprites(screen, xScroll, yScroll) {
    const xo = xScroll >> 4;
    const yo = yScroll >> 4;
    const w = (screen.w + 15) >> 4;
    const h = (screen.h + 15) >> 4;

    screen.setOffset(xScroll, yScroll);
    for (let y = yo; y <= h + yo; y++) {
      for (let x = xo; x <= w + xo; x++) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
        [].push.apply(this.rowSprites, this.entitiesInTiles[x + y * this.w]);
      }
      if (this.rowSprites.length > 0) {
        this.sortAndRender(screen, this.rowSprites);
      }
      this.rowSprites = [];
    }
    screen.setOffset(0, 0);
  }

  renderLight(screen, xScroll, yScroll) {
    const xo = xScroll >> 4;
    const yo = yScroll >> 4;
    const w = (screen.w + 15) >> 4;
    const h = (screen.h + 15) >> 4;
    const r = 4;
    let y;
    let x;
    let i;
    let entities;
    let e;
    let lr;

    screen.setOffset(xScroll, yScroll);
    for (y = yo - r; y <= h + yo + r; y++) {
      for (x = xo - r; x <= w + xo + r; x++) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
        entities = this.entitiesInTiles[x + y * this.w];
        for (i = 0; i < entities.length; i++) {
          e = entities[i];
          lr = e.getLightRadius();
          if (lr > 0) screen.renderLight(e.x - 1, e.y - 4, lr * 8);
        }
        lr = this.getTile(x, y).getLightRadius(this, x, y);
        if (lr > 0) screen.renderLight(x * 16 + 8, y * 16 + 8, lr * 8);
      }
    }
    screen.setOffset(0, 0);
  }

  sortAndRender(screen, list) {
    const sorted = list.sort(this.spriteSorter);
    for (let i = 0; i < sorted.length; i++) {
      sorted[i].render(screen);
    }
  }

  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return Tile.rock;
    return Tile.tiles[this.tiles[x + y * this.w]];
  }

  setTile(x, y, t, dataVal) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.tiles[x + y * this.w] = t.id;
    this.data[x + y * this.w] = dataVal;
  }

  getData(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.data[x + y * this.w] & 0xff;
  }

  setData(x, y, val) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data[x + y * this.w] = val;
  }

  add(entity) {
    if (entity instanceof Player) {
      this.player = entity;
    }
    entity.removed = false;
    this.entities.push(entity);
    entity.init(this);

    this.insertEntity(entity.x >> 4, entity.y >> 4, entity);
  }

  remove(e) {
    this.entities.remove(e);
    this.removeEntity(e.x >> 4, e.y >> 4, e);
  }

  insertEntity(x, y, e) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.entitiesInTiles[x + y * this.w].push(e);
  }

  removeEntity(x, y, e) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.entitiesInTiles[x + y * this.w].remove(e);
  }

  trySpawn(count) {
    for (let i = 0; i < count; i++) {
      let mob;
      let minLevel = 1;
      let maxLevel = 1;
      if (this.depth < 0) {
        maxLevel = (-this.depth) + 1;
      }
      if (this.depth > 0) {
        minLevel = maxLevel = 4;
      }

      const lvl = random.nextInt(maxLevel - minLevel + 1) + minLevel;
      if (random.nextInt(2) == 0) {
        mob = new Slime(lvl);
      } else {
        mob = new Zombie(lvl);
      }

      if (mob.findStartPos(this)) {
        this.add(mob);
      }
    }
  }

  tick() {
    this.trySpawn(1);
    let i;
    let l;
    let xt;
    let yt;
    let xto;
    let yto;
    let e;

    for (i = 0, l = this.w * this.h / 50; i < l; i++) {
      xt = random.nextInt(this.w);
      yt = random.nextInt(this.w); // should this be h?
      this.getTile(xt, yt).tick(this, xt, yt);
    }
    for (i = 0; i < this.entities.length; i++) {
      e = this.entities[i];
      xto = e.x >> 4;
      yto = e.y >> 4;

      e.tick();

      if (e.removed) {
        this.entities.splice(i--, 1);
        this.removeEntity(xto, yto, e);
      } else {
        xt = e.x >> 4;
        yt = e.x >> 4;

        if (xto != xt || yto != yt) {
          this.removeEntity(xto, yto, e);
          this.insertEntity(xt, yt, e);
        }
      }
    }
  }

  getEntities(x0, y0, x1, y1) {
    const result = [];
    const xt0 = (x0 >> 4) - 1;
    const yt0 = (y0 >> 4) - 1;
    const xt1 = (x1 >> 4) + 1;
    const yt1 = (y1 >> 4) + 1;
    for (let y = yt0; y <= yt1; y++) {
      for (let x = xt0; x <= xt1; x++) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
        const entities = this.entitiesInTiles[x + y * this.w];

        for (const e of entities) {
          if (e.intersects(x0, y0, x1, y1)) result.push(e);
        }
      }
    }
    return result;
  }
}



  // public class Level {
  //  private Random random = new Random();

  //  public int w, h;

  //  public byte[] tiles;
  //  public byte[] data;
  //  public List<Entity>[] entitiesInTiles;

  //  public int grassColor = 141;
  //  public int dirtColor = 322;
  //  public int sandColor = 550;
  //  private int depth;
  //  public int monsterDensity = 8;

  //  public List<Entity> entities = new ArrayList<Entity>();
  //  private Comparator<Entity> spriteSorter = new Comparator<Entity>() {
  //    public int compare(Entity e0, Entity e1) {
  //      if (e1.y < e0.y) return +1;
  //      if (e1.y > e0.y) return -1;
  //      return 0;
  //    }

  //  };

  //  @SuppressWarnings("unchecked")
  //  public Level(int w, int h, int level, Level parentLevel) {
  //    if (level < 0) {
  //      dirtColor = 222;
  //    }
  //    this.depth = level;
  //    this.w = w;
  //    this.h = h;
  //    byte[][] maps;

  //    if (level == 1) {
  //      dirtColor = 444;
  //    }
  //    if (level == 0)
  //      maps = LevelGen.createAndValidateTopMap(w, h);
  //    else if (level < 0) {
  //      maps = LevelGen.createAndValidateUndergroundMap(w, h, -level);
  //      monsterDensity = 4;
  //    } else {
  //      maps = LevelGen.createAndValidateSkyMap(w, h); // Sky level
  //      monsterDensity = 4;
  //    }

  //    tiles = maps[0];
  //    data = maps[1];

  //    if (parentLevel != null) {
  //      for (int y = 0; y < h; y++)
  //        for (int x = 0; x < w; x++) {
  //          if (parentLevel.getTile(x, y) == Tile.stairsDown) {

  //            setTile(x, y, Tile.stairsUp, 0);
  //            if (level == 0) {
  //              setTile(x - 1, y, Tile.hardRock, 0);
  //              setTile(x + 1, y, Tile.hardRock, 0);
  //              setTile(x, y - 1, Tile.hardRock, 0);
  //              setTile(x, y + 1, Tile.hardRock, 0);
  //              setTile(x - 1, y - 1, Tile.hardRock, 0);
  //              setTile(x - 1, y + 1, Tile.hardRock, 0);
  //              setTile(x + 1, y - 1, Tile.hardRock, 0);
  //              setTile(x + 1, y + 1, Tile.hardRock, 0);
  //            } else {
  //              setTile(x - 1, y, Tile.dirt, 0);
  //              setTile(x + 1, y, Tile.dirt, 0);
  //              setTile(x, y - 1, Tile.dirt, 0);
  //              setTile(x, y + 1, Tile.dirt, 0);
  //              setTile(x - 1, y - 1, Tile.dirt, 0);
  //              setTile(x - 1, y + 1, Tile.dirt, 0);
  //              setTile(x + 1, y - 1, Tile.dirt, 0);
  //              setTile(x + 1, y + 1, Tile.dirt, 0);
  //            }
  //          }

  //        }
  //    }

  //    entitiesInTiles = new ArrayList[w * h];
  //    for (int i = 0; i < w * h; i++) {
  //      entitiesInTiles[i] = new ArrayList<Entity>();
  //    }

  //    if (level==1) {
  //      AirWizard aw = new AirWizard();
  //      aw.x = w*8;
  //      aw.y = h*8;
  //      add(aw);
  //    }
  //  }

  //  public void renderBackground(Screen screen, int xScroll, int yScroll) {
  //    int xo = xScroll >> 4;
  //    int yo = yScroll >> 4;
  //    int w = (screen.w + 15) >> 4;
  //    int h = (screen.h + 15) >> 4;
  //    screen.setOffset(xScroll, yScroll);
  //    for (int y = yo; y <= h + yo; y++) {
  //      for (int x = xo; x <= w + xo; x++) {
  //        getTile(x, y).render(screen, this, x, y);
  //      }
  //    }
  //    screen.setOffset(0, 0);
  //  }

  //  private List<Entity> rowSprites = new ArrayList<Entity>();

  //  public Player player;

  //  public void renderSprites(Screen screen, int xScroll, int yScroll) {
  //    int xo = xScroll >> 4;
  //    int yo = yScroll >> 4;
  //    int w = (screen.w + 15) >> 4;
  //    int h = (screen.h + 15) >> 4;

  //    screen.setOffset(xScroll, yScroll);
  //    for (int y = yo; y <= h + yo; y++) {
  //      for (int x = xo; x <= w + xo; x++) {
  //        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
  //        rowSprites.addAll(entitiesInTiles[x + y * this.w]);
  //      }
  //      if (rowSprites.size() > 0) {
  //        sortAndRender(screen, rowSprites);
  //      }
  //      rowSprites.clear();
  //    }
  //    screen.setOffset(0, 0);
  //  }

  //  public void renderLight(Screen screen, int xScroll, int yScroll) {
  //    int xo = xScroll >> 4;
  //    int yo = yScroll >> 4;
  //    int w = (screen.w + 15) >> 4;
  //    int h = (screen.h + 15) >> 4;

  //    screen.setOffset(xScroll, yScroll);
  //    int r = 4;
  //    for (int y = yo - r; y <= h + yo + r; y++) {
  //      for (int x = xo - r; x <= w + xo + r; x++) {
  //        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
  //        List<Entity> entities = entitiesInTiles[x + y * this.w];
  //        for (int i = 0; i < entities.size(); i++) {
  //          Entity e = entities.get(i);
  //          // e.render(screen);
  //          int lr = e.getLightRadius();
  //          if (lr > 0) screen.renderLight(e.x - 1, e.y - 4, lr * 8);
  //        }
  //        int lr = getTile(x, y).getLightRadius(this, x, y);
  //        if (lr > 0) screen.renderLight(x * 16 + 8, y * 16 + 8, lr * 8);
  //      }
  //    }
  //    screen.setOffset(0, 0);
  //  }

  //  // private void renderLight(Screen screen, int x, int y, int r) {
  //  // screen.renderLight(x, y, r);
  //  // }

  //  private void sortAndRender(Screen screen, List<Entity> list) {
  //    Collections.sort(list, spriteSorter);
  //    for (int i = 0; i < list.size(); i++) {
  //      list.get(i).render(screen);
  //    }
  //  }

  //  public Tile getTile(int x, int y) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return Tile.rock;
  //    return Tile.tiles[tiles[x + y * w]];
  //  }

  //  public void setTile(int x, int y, Tile t, int dataVal) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return;
  //    tiles[x + y * w] = t.id;
  //    data[x + y * w] = (byte) dataVal;
  //  }

  //  public int getData(int x, int y) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  //    return data[x + y * w] & 0xff;
  //  }

  //  public void setData(int x, int y, int val) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return;
  //    data[x + y * w] = (byte) val;
  //  }

  //  public void add(Entity entity) {
  //    if (entity instanceof Player) {
  //      player = (Player) entity;
  //    }
  //    entity.removed = false;
  //    entities.add(entity);
  //    entity.init(this);

  //    insertEntity(entity.x >> 4, entity.y >> 4, entity);
  //  }

  //  public void remove(Entity e) {
  //    entities.remove(e);
  //    int xto = e.x >> 4;
  //    int yto = e.y >> 4;
  //    removeEntity(xto, yto, e);
  //  }

  //  private void insertEntity(int x, int y, Entity e) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return;
  //    entitiesInTiles[x + y * w].add(e);
  //  }

  //  private void removeEntity(int x, int y, Entity e) {
  //    if (x < 0 || y < 0 || x >= w || y >= h) return;
  //    entitiesInTiles[x + y * w].remove(e);
  //  }

  //  public void trySpawn(int count) {
  //    for (int i = 0; i < count; i++) {
  //      Mob mob;

  //      int minLevel = 1;
  //      int maxLevel = 1;
  //      if (depth < 0) {
  //        maxLevel = (-depth) + 1;
  //      }
  //      if (depth > 0) {
  //        minLevel = maxLevel = 4;
  //      }

  //      int lvl = random.nextInt(maxLevel - minLevel + 1) + minLevel;
  //      if (random.nextInt(2) == 0)
  //        mob = new Slime(lvl);
  //      else
  //        mob = new Zombie(lvl);

  //      if (mob.findStartPos(this)) {
  //        this.add(mob);
  //      }
  //    }
  //  }

  //  public void tick() {
  //    trySpawn(1);

  //    for (int i = 0; i < w * h / 50; i++) {
  //      int xt = random.nextInt(w);
  //      int yt = random.nextInt(w);
  //      getTile(xt, yt).tick(this, xt, yt);
  //    }
  //    for (int i = 0; i < entities.size(); i++) {
  //      Entity e = entities.get(i);
  //      int xto = e.x >> 4;
  //      int yto = e.y >> 4;

  //      e.tick();

  //      if (e.removed) {
  //        entities.remove(i--);
  //        removeEntity(xto, yto, e);
  //      } else {
  //        int xt = e.x >> 4;
  //        int yt = e.y >> 4;

  //        if (xto != xt || yto != yt) {
  //          removeEntity(xto, yto, e);
  //          insertEntity(xt, yt, e);
  //        }
  //      }
  //    }
  //  }

  //  public List<Entity> getEntities(int x0, int y0, int x1, int y1) {
  //    List<Entity> result = new ArrayList<Entity>();
  //    int xt0 = (x0 >> 4) - 1;
  //    int yt0 = (y0 >> 4) - 1;
  //    int xt1 = (x1 >> 4) + 1;
  //    int yt1 = (y1 >> 4) + 1;
  //    for (int y = yt0; y <= yt1; y++) {
  //      for (int x = xt0; x <= xt1; x++) {
  //        if (x < 0 || y < 0 || x >= w || y >= h) continue;
  //        List<Entity> entities = entitiesInTiles[x + y * this.w];
  //        for (int i = 0; i < entities.size(); i++) {
  //          Entity e = entities.get(i);
  //          if (e.intersects(x0, y0, x1, y1)) result.add(e);
  //        }
  //      }
  //    }
  //    return result;
  //  }
  // }

// package com.mojang.ld22.entity;

// import java.util.List;

// import com.mojang.ld22.Game;
// import com.mojang.ld22.InputHandler;
// import com.mojang.ld22.entity.particle.TextParticle;
// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.item.FurnitureItem;
// import com.mojang.ld22.item.Item;
// import com.mojang.ld22.item.PowerGloveItem;
// import com.mojang.ld22.item.ResourceItem;
// import com.mojang.ld22.item.ToolItem;
// import com.mojang.ld22.item.ToolType;
// import com.mojang.ld22.item.resource.Resource;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;
// import com.mojang.ld22.screen.InventoryMenu;
// import com.mojang.ld22.sound.Sound;

class Player extends Mob {

  constructor(game, input) {
    super()
    this.inventory = new Inventory()
    this.attackItem = null
    this.activeItem = null
    this.staminaRecharge = 0
    this.staminaRechargeDelay = 0
    this.score = 0
    this.onStairDelay = 0
    this.invulnerableTime = 0

    this.game = game
    this.input = input
    this.x = 24
    this.y = 24
    this.stamina = this.maxStamina = 10

    this.inventory.add(new FurnitureItem(new Workbench()))
    this.inventory.add(new PowerGloveItem())
  }

  tick() {
    super.tick()

    if (this.invulnerableTime > 0) this.invulnerableTime--
    const onTile = this.level.getTile(this.x >> 4, this.y >> 4)
    if (onTile == Tile.stairsDown || onTile == Tile.stairsUp) {
      if (this.onStairDelay == 0) {
        this.changeLevel((onTile == Tile.stairsUp) ? 1 : -1)
        this.onStairDelay = 10
        return
      }
      this.onStairDelay = 10
    } else {
      if (this.onStairDelay > 0) this.onStairDelay--
    }

    if (this.stamina <= 0 && this.staminaRechargeDelay == 0 && this.staminaRecharge == 0) {
      this.staminaRechargeDelay = 40
    }

    if (this.staminaRechargeDelay > 0) {
      this.staminaRechargeDelay--
    }

    if (this.staminaRechargeDelay == 0) {
      this.staminaRecharge++
      if (this.isSwimming()) {
        this.staminaRecharge = 0
      }
      while (this.staminaRecharge > 10) {
        this.staminaRecharge -= 10
        if (this.stamina < this.maxStamina) this.stamina++
      }
    }

    let xa = 0
    let ya = 0
    if (this.input.up.down) ya--
    if (this.input.down.down) ya++
    if (this.input.left.down) xa--
    if (this.input.right.down) xa++
    if (this.isSwimming() && this.tickTime % 60 == 0) {
      if (this.stamina > 0) {
        this.stamina--
      } else {
        this.hurt(this, 1, this.dir ^ 1)
      }
    }

    if (this.staminaRechargeDelay % 2 == 0) {
      this.move(xa, ya)
    }

    if (this.input.attack.clicked) {
      if (this.stamina == 0) {

      } else {
        this.stamina--
        this.staminaRecharge = 0
        this.attack()
      }
    }
    if (this.input.menu.clicked) {
      if (!this.tryUse()) {
        this.game.setMenu(new InventoryMenu(this))
      }
    }
    if (this.attackTime > 0) this.attackTime--

  }

  tryUse() {
    const yo = -2
    const x = this.x
    const y = this.y
    if (this.dir == 0 && this.use(x - 8, y + 4 + yo, x + 8, y + 12 + yo)) return true
    if (this.dir == 1 && this.use(x - 8, y - 12 + yo, x + 8, y - 4 + yo)) return true
    if (this.dir == 3 && this.use(x + 4, y - 8 + yo, x + 12, y + 8 + yo)) return true
    if (this.dir == 2 && this.use(x - 12, y - 8 + yo, x - 4, y + 8 + yo)) return true

    let xt = x >> 4
    let yt = (y + yo) >> 4
    const r = 12
    if (this.attackDir == 0) yt = (y + r + yo) >> 4
    if (this.attackDir == 1) yt = (y - r + yo) >> 4
    if (this.attackDir == 2) xt = (x - r) >> 4
    if (this.attackDir == 3) xt = (x + r) >> 4

    if (xt >= 0 && yt >= 0 && xt < this.level.w && yt < this.level.h) {
      if (this.level.getTile(xt, yt).use(this.level, xt, yt, this, this.attackDir)) return true
    }

    return false
  }

  attack() {
    this.walkDist += 8
    this.attackDir = this.dir
    this.attackItem = this.activeItem
    let done = false
    const x = this.x
    const y = this.y
    let yo
    let range
    let xt
    let yt
    let r

    if (this.activeItem != null) {
      this.attackTime = 10
      yo = -2
      range = 12
      if (this.dir == 0 && this.interact(x - 8, y + 4 + yo, x + 8, y + range + yo)) done = true
      if (this.dir == 1 && this.interact(x - 8, y - range + yo, x + 8, y - 4 + yo)) done = true
      if (this.dir == 2 && this.interact(x + 4, y - 8 + yo, x + range, y + 8 + yo)) done = true
      if (this.dir == 3 && this.interact(x - range, y - 8 + yo, x - 4, y + 8 + yo)) done = true
      if (done) return

      xt = x >> 4
      yt = (y + yo) >> 4
      r = 12
      if (this.attackDir == 0) yt = (y + r + yo) >> 4
      if (this.attackDir == 1) yt = (y - r + yo) >> 4
      if (this.attackDir == 2) xt = (x - r) >> 4
      if (this.attackDir == 3) xt = (x + r) >> 4

      if (xt >= 0 && yt >= 0 && xt < this.level.w && yt < this.level.h) {
        if (this.activeItem.interactOn(this.level.getTile(xt, yt), this.level, xt, yt, this, this.attackDir)) {
          done = true
        } else {
          if (this.level.getTile(xt, yt).interact(this.level, xt, yt, this, this.activeItem, this.attackDir)) {
            done = true
          }
        }
        if (this.activeItem.isDepleted()) {
          this.activeItem = null
        }
      }
    }

    if (done) return

    if (this.activeItem == null || this.activeItem.canAttack()) {
      this.attackTime = 5
      yo = -2
      range = 20
      if (this.dir == 0) this.hurt(x - 8, y + 4 + yo, x + 8, y + range + yo)
      if (this.dir == 1) this.hurt(x - 8, y - range + yo, x + 8, y - 4 + yo)
      if (this.dir == 3) this.hurt(x + 4, y - 8 + yo, x + range, y + 8 + yo)
      if (this.dir == 2) this.hurt(x - range, y - 8 + yo, x - 4, y + 8 + yo)

      xt = x >> 4
      yt = (y + yo) >> 4
      r = 12
      if (this.attackDir == 0) yt = (y + r + yo) >> 4
      if (this.attackDir == 1) yt = (y - r + yo) >> 4
      if (this.attackDir == 2) xt = (x - r) >> 4
      if (this.attackDir == 3) xt = (x + r) >> 4

      if (xt >= 0 && yt >= 0 && xt < this.level.w && yt < this.level.h) {
        this.level.getTile(xt, yt).hurt(this.level, xt, yt, this, random.nextInt(3) + 1, this.attackDir)
      }
    }
  }

  use(x0, y0, x1, y1) {
    const entities = this.level.getEntities(x0, y0, x1, y1)

    for (const e of entities) {
      if (e != this) if (e.use(this, this.attackDir)) return true
    }

    return false
  }

  interact(x0, y0, x1, y1) {
    const entities = this.level.getEntities(x0, y0, x1, y1)

    for (const e of entities) {
      if (e != this) if (e.interact(this, this.activeItem, this.attackDir)) return true
    }

    return false
  }

  hurt(x0, y0, x1, y1) {
    const entities = this.level.getEntities(x0, y0, x1, y1)

    for (const e of entities) {
      if (e != this) e.hurt(this, this.getAttackDamage(e), this.attackDir)
    }
  }

  getAttackDamage(e) {
    let dmg = random.nextInt(3) + 1
    if (this.attackItem != null) {
      dmg += this.attackItem.getAttackDamageBonus(e)
    }
    return dmg
  }

  render(screen) {
    const x = this.x
    const y = this.y

    let xt = 0
    let yt = 14

    let flip1 = (this.walkDist >> 3) & 1
    let flip2 = (this.walkDist >> 3) & 1

    if (this.dir == 1) {
      xt += 2
    }
    if (this.dir > 1) {
      flip1 = 0
      flip2 = (this.walkDist >> 4) & 1
      if (this.dir == 2) {
        flip1 = 1
      }
      xt += 4 + ((this.walkDist >> 3) & 1) * 2
    }

    const xo = x - 8
    let yo = y - 11
    if (this.isSwimming()) {
      yo += 4
      let waterColor = Color.get(-1, -1, 115, 335)
      if (Math.floor(this.tickTime / 8) % 2 == 0) {
        waterColor = Color.get(-1, 335, 5, 115)
      }
      screen.render(xo + 0, yo + 3, 5 + 13 * 32, waterColor, 0)
      screen.render(xo + 8, yo + 3, 5 + 13 * 32, waterColor, 1)
    }


    const attackColor = Color.get(-1, 555, 555, 555)
    if (this.attackTime > 0 && this.attackDir == 1) {
      screen.render(xo + 0, yo - 4, 6 + 13 * 32, attackColor, 0)
      screen.render(xo + 8, yo - 4, 6 + 13 * 32, attackColor, 1)
      if (this.attackItem != null) {
        this.attackItem.renderIcon(screen, xo + 4, yo - 4)
      }
    }
    let col = Color.get(-1, 100, 220, 532)
    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555)
    }

    if (this.activeItem instanceof FurnitureItem) {
      yt += 2
    }
    // flip1 = flip2 = 0
    screen.render(xo + 8 * flip1, yo + 0, xt + yt * 32, col, flip1)
    screen.render(xo + 8 - 8 * flip1, yo + 0, xt + 1 + yt * 32, col, flip1)
    if (!this.isSwimming()) {
      screen.render(xo + 8 * flip2, yo + 8, xt + (yt + 1) * 32, col, flip2)
      screen.render(xo + 8 - 8 * flip2, yo + 8, xt + 1 + (yt + 1) * 32, col, flip2)
    }

    if (this.attackTime > 0 && this.attackDir == 2) {
      screen.render(xo - 4, yo, 7 + 13 * 32, attackColor, 1)
      screen.render(xo - 4, yo + 8, 7 + 13 * 32, attackColor, 3)
      if (this.attackItem != null) {
        this.attackItem.renderIcon(screen, xo - 4, yo + 4)
      }
    }
    if (this.attackTime > 0 && this.attackDir == 3) {
      screen.render(xo + 8 + 4, yo, 7 + 13 * 32, attackColor, 0)
      screen.render(xo + 8 + 4, yo + 8, 7 + 13 * 32, attackColor, 2)
      if (this.attackItem != null) {
        this.attackItem.renderIcon(screen, xo + 8 + 4, yo + 4)
      }
    }
    if (this.attackTime > 0 && this.attackDir == 0) {
      screen.render(xo + 0, yo + 8 + 4, 6 + 13 * 32, attackColor, 2)
      screen.render(xo + 8, yo + 8 + 4, 6 + 13 * 32, attackColor, 3)
      if (this.attackItem != null) {
        this.attackItem.renderIcon(screen, xo + 4, yo + 8 + 4)
      }
    }

    if (this.activeItem instanceof FurnitureItem) {
      const furniture = this.activeItem.furniture
      furniture.x = x
      furniture.y = y
      furniture.render(screen)
    }
  }

  touchItem(itemEntity) {
    itemEntity.take(this)
    this.inventory.add(itemEntity.item)
  }

  canSwim() {
    return true
  }

  findStartPos(level) {
    while (true) {
      const x = random.nextInt(level.w)
      const y = random.nextInt(level.h)
      if (level.getTile(x, y) == Tile.grass) {
        this.x = x * 16 + 8
        this.y = y * 16 + 8
        return true
      }
    }
  }

  payStamina(cost) {
    if (cost > this.stamina) return false
    this.stamina -= cost
    return true
  }

  changeLevel(dir) {
    this.game.scheduleLevelChange(dir)
  }

  getLightRadius() {
    let r = 2
    if (this.activeItem != null) {
      if (this.activeItem instanceof FurnitureItem) {
        const rr = this.activeItem.furniture.getLightRadius()
        if (rr > r) r = rr
      }
    }
    return r
  }

  die() {
    super.die()
    Sound.playerDeath.play()
  }

  touchedBy(entity) {
    if (!(entity instanceof Player)) {
      entity.touchedBy(this)
    }
  }

  doHurt(damage, attackDir) {
    if (this.hurtTime > 0 || this.invulnerableTime > 0) return

    Sound.playerHurt.play()
    this.level.add(new TextParticle(`${damage}`, this.x, this.style, Color.get(asHSL-1, 504, 504, 504)))
    this.health -= damage
    if (this.attackDir == 0) this.yKnockback = +6
    if (this.attackDir == 1) this.yKnockback = -6
    if (this.attackDir == 2) this.xKnockback = -6
    if (this.attackDir == 3) this.xKnockback = +6
    this.hurtTime = 10
    this.invulnerableTime = 30
  }

  gameWon() {
    this.level.player.invulnerableTime = 60 * 5
    this.game.won()
  }
}



// public class Player extends Mob {
//  private InputHandler input;
//  private int attackTime, attackDir;

//  public Game game;
//  public Inventory inventory = new Inventory();
//  public Item attackItem;
//  public Item activeItem;
//  public int stamina;
//  public int staminaRecharge;
//  public int staminaRechargeDelay;
//  public int score;
//  public int maxStamina = 10;
//  private int onStairDelay;
//  public int invulnerableTime = 0;

//  public Player(Game game, InputHandler input) {
//    this.game = game;
//    this.input = input;
//    x = 24;
//    y = 24;
//    stamina = maxStamina;

//    inventory.add(new FurnitureItem(new Workbench()));
//    inventory.add(new PowerGloveItem());
//  }

//  public void tick() {
//    super.tick();

//    if (invulnerableTime > 0) invulnerableTime--;
//    Tile onTile = level.getTile(x >> 4, y >> 4);
//    if (onTile == Tile.stairsDown || onTile == Tile.stairsUp) {
//      if (onStairDelay == 0) {
//        changeLevel((onTile == Tile.stairsUp) ? 1 : -1);
//        onStairDelay = 10;
//        return;
//      }
//      onStairDelay = 10;
//    } else {
//      if (onStairDelay > 0) onStairDelay--;
//    }

//    if (stamina <= 0 && staminaRechargeDelay == 0 && staminaRecharge == 0) {
//      staminaRechargeDelay = 40;
//    }

//    if (staminaRechargeDelay > 0) {
//      staminaRechargeDelay--;
//    }

//    if (staminaRechargeDelay == 0) {
//      staminaRecharge++;
//      if (isSwimming()) {
//        staminaRecharge = 0;
//      }
//      while (staminaRecharge > 10) {
//        staminaRecharge -= 10;
//        if (stamina < maxStamina) stamina++;
//      }
//    }

//    int xa = 0;
//    int ya = 0;
//    if (input.up.down) ya--;
//    if (input.down.down) ya++;
//    if (input.left.down) xa--;
//    if (input.right.down) xa++;
//    if (isSwimming() && tickTime % 60 == 0) {
//      if (stamina > 0) {
//        stamina--;
//      } else {
//        hurt(this, 1, dir ^ 1);
//      }
//    }

//    if (staminaRechargeDelay % 2 == 0) {
//      move(xa, ya);
//    }

//    if (input.attack.clicked) {
//      if (stamina == 0) {

//      } else {
//        stamina--;
//        staminaRecharge = 0;
//        attack();
//      }
//    }
//    if (input.menu.clicked) {
//      if (!use()) {
//        game.setMenu(new InventoryMenu(this));
//      }
//    }
//    if (attackTime > 0) attackTime--;

//  }

//  private boolean use() {
//    int yo = -2;
//    if (dir == 0 && use(x - 8, y + 4 + yo, x + 8, y + 12 + yo)) return true;
//    if (dir == 1 && use(x - 8, y - 12 + yo, x + 8, y - 4 + yo)) return true;
//    if (dir == 3 && use(x + 4, y - 8 + yo, x + 12, y + 8 + yo)) return true;
//    if (dir == 2 && use(x - 12, y - 8 + yo, x - 4, y + 8 + yo)) return true;

//    int xt = x >> 4;
//    int yt = (y + yo) >> 4;
//    int r = 12;
//    if (attackDir == 0) yt = (y + r + yo) >> 4;
//    if (attackDir == 1) yt = (y - r + yo) >> 4;
//    if (attackDir == 2) xt = (x - r) >> 4;
//    if (attackDir == 3) xt = (x + r) >> 4;

//    if (xt >= 0 && yt >= 0 && xt < level.w && yt < level.h) {
//      if (level.getTile(xt, yt).use(level, xt, yt, this, attackDir)) return true;
//    }

//    return false;
//  }

//  private void attack() {
//    walkDist += 8;
//    attackDir = dir;
//    attackItem = activeItem;
//    boolean done = false;

//    if (activeItem != null) {
//      attackTime = 10;
//      int yo = -2;
//      int range = 12;
//      if (dir == 0 && interact(x - 8, y + 4 + yo, x + 8, y + range + yo)) done = true;
//      if (dir == 1 && interact(x - 8, y - range + yo, x + 8, y - 4 + yo)) done = true;
//      if (dir == 3 && interact(x + 4, y - 8 + yo, x + range, y + 8 + yo)) done = true;
//      if (dir == 2 && interact(x - range, y - 8 + yo, x - 4, y + 8 + yo)) done = true;
//      if (done) return;

//      int xt = x >> 4;
//      int yt = (y + yo) >> 4;
//      int r = 12;
//      if (attackDir == 0) yt = (y + r + yo) >> 4;
//      if (attackDir == 1) yt = (y - r + yo) >> 4;
//      if (attackDir == 2) xt = (x - r) >> 4;
//      if (attackDir == 3) xt = (x + r) >> 4;

//      if (xt >= 0 && yt >= 0 && xt < level.w && yt < level.h) {
//        if (activeItem.interactOn(level.getTile(xt, yt), level, xt, yt, this, attackDir)) {
//          done = true;
//        } else {
//          if (level.getTile(xt, yt).interact(level, xt, yt, this, activeItem, attackDir)) {
//            done = true;
//          }
//        }
//        if (activeItem.isDepleted()) {
//          activeItem = null;
//        }
//      }
//    }

//    if (done) return;

//    if (activeItem == null || activeItem.canAttack()) {
//      attackTime = 5;
//      int yo = -2;
//      int range = 20;
//      if (dir == 0) hurt(x - 8, y + 4 + yo, x + 8, y + range + yo);
//      if (dir == 1) hurt(x - 8, y - range + yo, x + 8, y - 4 + yo);
//      if (dir == 3) hurt(x + 4, y - 8 + yo, x + range, y + 8 + yo);
//      if (dir == 2) hurt(x - range, y - 8 + yo, x - 4, y + 8 + yo);

//      int xt = x >> 4;
//      int yt = (y + yo) >> 4;
//      int r = 12;
//      if (attackDir == 0) yt = (y + r + yo) >> 4;
//      if (attackDir == 1) yt = (y - r + yo) >> 4;
//      if (attackDir == 2) xt = (x - r) >> 4;
//      if (attackDir == 3) xt = (x + r) >> 4;

//      if (xt >= 0 && yt >= 0 && xt < level.w && yt < level.h) {
//        level.getTile(xt, yt).hurt(level, xt, yt, this, random.nextInt(3) + 1, attackDir);
//      }
//    }

//  }

//  private boolean use(int x0, int y0, int x1, int y1) {
//    List<Entity> entities = level.getEntities(x0, y0, x1, y1);
//    for (int i = 0; i < entities.size(); i++) {
//      Entity e = entities.get(i);
//      if (e != this) if (e.use(this, attackDir)) return true;
//    }
//    return false;
//  }

//  private boolean interact(int x0, int y0, int x1, int y1) {
//    List<Entity> entities = level.getEntities(x0, y0, x1, y1);
//    for (int i = 0; i < entities.size(); i++) {
//      Entity e = entities.get(i);
//      if (e != this) if (e.interact(this, activeItem, attackDir)) return true;
//    }
//    return false;
//  }

//  private void hurt(int x0, int y0, int x1, int y1) {
//    List<Entity> entities = level.getEntities(x0, y0, x1, y1);
//    for (int i = 0; i < entities.size(); i++) {
//      Entity e = entities.get(i);
//      if (e != this) e.hurt(this, getAttackDamage(e), attackDir);
//    }
//  }

//  private int getAttackDamage(Entity e) {
//    int dmg = random.nextInt(3) + 1;
//    if (attackItem != null) {
//      dmg += attackItem.getAttackDamageBonus(e);
//    }
//    return dmg;
//  }

//  public void render(Screen screen) {
//    int xt = 0;
//    int yt = 14;

//    int flip1 = (walkDist >> 3) & 1;
//    int flip2 = (walkDist >> 3) & 1;

//    if (dir == 1) {
//      xt += 2;
//    }
//    if (dir > 1) {
//      flip1 = 0;
//      flip2 = ((walkDist >> 4) & 1);
//      if (dir == 2) {
//        flip1 = 1;
//      }
//      xt += 4 + ((walkDist >> 3) & 1) * 2;
//    }

//    int xo = x - 8;
//    int yo = y - 11;
//    if (isSwimming()) {
//      yo += 4;
//      int waterColor = Color.get(-1, -1, 115, 335);
//      if (tickTime / 8 % 2 == 0) {
//        waterColor = Color.get(-1, 335, 5, 115);
//      }
//      screen.render(xo + 0, yo + 3, 5 + 13 * 32, waterColor, 0);
//      screen.render(xo + 8, yo + 3, 5 + 13 * 32, waterColor, 1);
//    }

//    if (attackTime > 0 && attackDir == 1) {
//      screen.render(xo + 0, yo - 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 0);
//      screen.render(xo + 8, yo - 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 1);
//      if (attackItem != null) {
//        attackItem.renderIcon(screen, xo + 4, yo - 4);
//      }
//    }
//    int col = Color.get(-1, 100, 220, 532);
//    if (hurtTime > 0) {
//      col = Color.get(-1, 555, 555, 555);
//    }

//    if (activeItem instanceof FurnitureItem) {
//      yt += 2;
//    }
//    screen.render(xo + 8 * flip1, yo + 0, xt + yt * 32, col, flip1);
//    screen.render(xo + 8 - 8 * flip1, yo + 0, xt + 1 + yt * 32, col, flip1);
//    if (!isSwimming()) {
//      screen.render(xo + 8 * flip2, yo + 8, xt + (yt + 1) * 32, col, flip2);
//      screen.render(xo + 8 - 8 * flip2, yo + 8, xt + 1 + (yt + 1) * 32, col, flip2);
//    }

//    if (attackTime > 0 && attackDir == 2) {
//      screen.render(xo - 4, yo, 7 + 13 * 32, Color.get(-1, 555, 555, 555), 1);
//      screen.render(xo - 4, yo + 8, 7 + 13 * 32, Color.get(-1, 555, 555, 555), 3);
//      if (attackItem != null) {
//        attackItem.renderIcon(screen, xo - 4, yo + 4);
//      }
//    }
//    if (attackTime > 0 && attackDir == 3) {
//      screen.render(xo + 8 + 4, yo, 7 + 13 * 32, Color.get(-1, 555, 555, 555), 0);
//      screen.render(xo + 8 + 4, yo + 8, 7 + 13 * 32, Color.get(-1, 555, 555, 555), 2);
//      if (attackItem != null) {
//        attackItem.renderIcon(screen, xo + 8 + 4, yo + 4);
//      }
//    }
//    if (attackTime > 0 && attackDir == 0) {
//      screen.render(xo + 0, yo + 8 + 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 2);
//      screen.render(xo + 8, yo + 8 + 4, 6 + 13 * 32, Color.get(-1, 555, 555, 555), 3);
//      if (attackItem != null) {
//        attackItem.renderIcon(screen, xo + 4, yo + 8 + 4);
//      }
//    }

//    if (activeItem instanceof FurnitureItem) {
//      Furniture furniture = ((FurnitureItem) activeItem).furniture;
//      furniture.x = x;
//      furniture.y = yo;
//      furniture.render(screen);

//    }
//  }

//  public void touchItem(ItemEntity itemEntity) {
//    itemEntity.take(this);
//    inventory.add(itemEntity.item);
//  }

//  public boolean canSwim() {
//    return true;
//  }

//  public boolean findStartPos(Level level) {
//    while (true) {
//      int x = random.nextInt(level.w);
//      int y = random.nextInt(level.h);
//      if (level.getTile(x, y) == Tile.grass) {
//        this.x = x * 16 + 8;
//        this.y = y * 16 + 8;
//        return true;
//      }
//    }
//  }

//  public boolean payStamina(int cost) {
//    if (cost > stamina) return false;
//    stamina -= cost;
//    return true;
//  }

//  public void changeLevel(int dir) {
//    game.scheduleLevelChange(dir);
//  }

//  public int getLightRadius() {
//    int r = 2;
//    if (activeItem != null) {
//      if (activeItem instanceof FurnitureItem) {
//        int rr = ((FurnitureItem) activeItem).furniture.getLightRadius();
//        if (rr > r) r = rr;
//      }
//    }
//    return r;
//  }

//  protected void die() {
//    super.die();
//    Sound.playerDeath.play();
//  }

//  protected void touchedBy(Entity entity) {
//    if (!(entity instanceof Player)) {
//      entity.touchedBy(this);
//    }
//  }

//  protected void doHurt(int damage, int attackDir) {
//    if (hurtTime > 0 || invulnerableTime > 0) return;

//    Sound.playerHurt.play();
//    level.add(new TextParticle("" + damage, x, y, Color.get(-1, 504, 504, 504)));
//    health -= damage;
//    if (attackDir == 0) yKnockback = +6;
//    if (attackDir == 1) yKnockback = -6;
//    if (attackDir == 2) xKnockback = -6;
//    if (attackDir == 3) xKnockback = +6;
//    hurtTime = 10;
//    invulnerableTime = 30;
//  }

//  public void gameWon() {
//    level.player.invulnerableTime = 60 * 5;
//    game.won();
//  }
// }

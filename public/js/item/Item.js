// package com.mojang.ld22.item;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.entity.ItemEntity;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;
// import com.mojang.ld22.screen.ListItem;

class Item extends ListItem {
    getColor() {
			return 0;
		}

    getSprite() {
			return 0;
		}

    onTake(itemEntity) { }
	    renderInventory(screen, x, y) { }

	    interact(player, entity, attackDir) {
			return false;
		}

    renderIcon(screen, x, y) { }

	    interactOn(tile, level, xt, yt, player, attackDir) {
			return false;
		}

    isDepleted() {
			return false;
		}

    canAttack() {
			return false;
		}

    getAttackDamageBonus(e) {
			return 0;
		}

    getName() {
			return '';
		}

    matches(item) {
			//return item.getClass() == this.getClass();
			return item.constructor == this.constructor;
		}
}


// public class Item implements ListItem {
// 	public int getColor() {
// 		return 0;
// 	}

// 	public int getSprite() {
// 		return 0;
// 	}

// 	public void onTake(ItemEntity itemEntity) {
// 	}

// 	public void renderInventory(Screen screen, int x, int y) {
// 	}

// 	public boolean interact(Player player, Entity entity, int attackDir) {
// 		return false;
// 	}

// 	public void renderIcon(Screen screen, int x, int y) {
// 	}

// 	public boolean interactOn(Tile tile, Level level, int xt, int yt, Player player, int attackDir) {
// 		return false;
// 	}

// 	public boolean isDepleted() {
// 		return false;
// 	}

// 	public boolean canAttack() {
// 		return false;
// 	}

// 	public int getAttackDamageBonus(Entity e) {
// 		return 0;
// 	}

// 	public String getName() {
// 		return "";
// 	}

// 	public boolean matches(Item item) {
// 		return item.getClass() == getClass();
// 	}
// }

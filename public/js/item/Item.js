// package com.mojang.ld22.item;

// import com.mojang.ld22.entity.Entity;
// import com.mojang.ld22.entity.ItemEntity;
// import com.mojang.ld22.entity.Player;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.level.Level;
// import com.mojang.ld22.level.tile.Tile;
// import com.mojang.ld22.screen.ListItem;

function Item() {

}

Item.Super = ListItem.prototype;
Item.prototype = extend(new ListItem(), {

	getColor: function() {
		return 0;
	},

	getSprite: function() {
		return 0;
	},

	onTake: function(itemEntity) { },

	renderInventory: function(screen, x, y) { },

	interact: function(player, entity, attackDir) {
		return false;
	},

	renderIcon: function(screen, x, y) { },

	interactOn: function(tile, level, xt, yt, player, attackDir) {
		return false;
	},

	isDepleted: function() {
		return false;
	},

	canAttack: function() {
		return false;
	},

	getAttackDamageBonus: function(e) {
		return 0;
	},

	getName: function() {
		return '';
	},

	matches: function(item) {
		//return item.getClass() == this.getClass();
		return item.constructor == this.constructor;
	}

});



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

function WheatTile(id) {
	WheatTile.Super.init.call(this, id);
}

WheatTile.Super = Tile.prototype;
WheatTile.prototype = extend({}, new Tile(), {

	render: function(screen, level, x, y) {
		var age = level.getData(x, y);
		var col = Color.get(level.dirtColor - 121, level.dirtColor - 11, level.dirtColor, 50);
		var icon = age / 10;
		if (icon >= 3) {
			col = Color.get(level.dirtColor - 121, level.dirtColor - 11, 50 + (icon) * 100, 40 + (icon - 3) * 2 * 100);
			if (age == 50) {
				col = Color.get(0, 0, 50 + (icon) * 100, 40 + (icon - 3) * 2 * 100);
			}
			icon = 3;
		}

		screen.render(x * 16 + 0, y * 16 + 0, 4 + 3 * 32 + icon, col, 0);
		screen.render(x * 16 + 8, y * 16 + 0, 4 + 3 * 32 + icon, col, 0);
		screen.render(x * 16 + 0, y * 16 + 8, 4 + 3 * 32 + icon, col, 1);
		screen.render(x * 16 + 8, y * 16 + 8, 4 + 3 * 32 + icon, col, 1);
	},

	tick: function(level, xt, yt) {
		if (random.nextInt(2) == 0) return;

		var age = level.getData(xt, yt);
		if (age < 50) level.setData(xt, yt, age + 1);
	},

	interact: function(level, xt, yt, player, item, attackDir) {
		if (item instanceof ToolItem) {
			var tool = item;
			if (tool.type == ToolType.shovel) {
				if (player.payStamina(4 - tool.level)) {
					level.setTile(xt, yt, Tile.dirt, 0);
					return true;
				}
			}
		}
		return false;
	},

	steppedOn: function(level, xt, yt, entity) {
		if (random.nextInt(60) != 0) return;
		if (level.getData(xt, yt) < 2) return;
		harvest(level, xt, yt);
	},

	hurt: function(level, x, y, source, dmg, attackDir) {
		harvest(level, x, y);
	},

	harvest: function(level, x, y) {
		var age = level.getData(x, y);

		var count = random.nextInt(2);
		for (var i = 0; i < count; i++) {
			level.add(new ItemEntity(new ResourceItem(Resource.seeds), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
		}

		count = 0;
		if (age == 50) {
			count = random.nextInt(3) + 2;
		} else if (age >= 40) {
			count = random.nextInt(2) + 1;
		}
		for (i = 0; i < count; i++) {
			level.add(new ItemEntity(new ResourceItem(Resource.wheat), x * 16 + random.nextInt(10) + 3, y * 16 + random.nextInt(10) + 3));
		}

		level.setTile(x, y, Tile.dirt, 0);
	}

});
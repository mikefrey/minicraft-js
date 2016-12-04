

function LevelGen(w, h, featureSize) {
	this.values = [];
	this.w = w;
	this.h = h;

	var x, y, a, b, c, d, e, f, H, g;

	for (y = 0; y < h; y += featureSize) {
		for (x = 0; x < w; x += featureSize) {
			this.setSample(x, y, random.nextFloat() * 2 - 1);
		}
	}

	var stepSize = featureSize;
	var scale = 1.0 / w;
	var scaleMod = 1;
	do {
		var halfStep = stepSize / 2 | 0;
		for (y = 0; y < h; y += stepSize) {
			for (x = 0; x < w; x += stepSize) {
				a = this.sample(x, y);
				b = this.sample(x + stepSize, y);
				c = this.sample(x, y + stepSize);
				d = this.sample(x + stepSize, y + stepSize);

				e = (a + b + c + d) / 4 + (random.nextFloat() * 2 - 1) * stepSize * scale;
				this.setSample(x + halfStep, y + halfStep, e);
			}
		}
		for (y = 0; y < h; y += stepSize) {
			for (x = 0; x < w; x += stepSize) {
				a = this.sample(x, y);
				b = this.sample(x + stepSize, y);
				c = this.sample(x, y + stepSize);
				d = this.sample(x + halfStep, y + halfStep);
				e = this.sample(x + halfStep, y - halfStep);
				f = this.sample(x - halfStep, y + halfStep);

				H = (a + b + d + e) / 4 + (random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
				g = (a + c + d + f) / 4 + (random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
				this.setSample(x + halfStep, y, H);
				this.setSample(x, y + halfStep, g);
			}
		}
		stepSize /= 2;
		scale *= (scaleMod + 0.8);
		scaleMod *= 0.3;
	} while (stepSize > 1);
}

LevelGen.prototype = {

	sample: function(x, y) {
		return this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w];
	},

	setSample: function(x, y, value) {
		this.values[(x & (this.w - 1)) + (y & (this.h - 1)) * this.w] = value;
	}

};


extend(LevelGen, {

	createAndValidateTopMap: function(w, h) {
		var attempt = 0;
		do {
			var result = LevelGen.createTopMap(w, h);
			var count = [];

			var l = w * h;
			for (var i = 0; i < l; i++) {
				count[result[0][i] & 0xff]++;
			}
			if (count[Tile.rock.id & 0xff] < 100) continue;
			if (count[Tile.sand.id & 0xff] < 100) continue;
			if (count[Tile.grass.id & 0xff] < 100) continue;
			if (count[Tile.tree.id & 0xff] < 100) continue;
			if (count[Tile.stairsDown.id & 0xff] < 2) continue;

			return result;
		} while (true);
	},

	createAndValidateUndergroundMap: function(w, h, depth) {
		var attempt = 0;
		do {
			var result = LevelGen.createUndergroundMap(w, h, depth);
			var count = [];
			var l = w * h;

			for (var i = 0; i < l; i++) {
				count[result[0][i] & 0xff]++;
			}
			if (count[Tile.rock.id & 0xff] < 100) continue;
			if (count[Tile.dirt.id & 0xff] < 100) continue;
			if (count[(Tile.ironOre.id & 0xff) + depth - 1] < 20) continue;
			if (depth < 3 && count[Tile.stairsDown.id & 0xff] < 2) continue;

			return result;
		} while (true);
	},

	createAndValidateSkyMap: function(w, h) {
		var attempt = 0;
		do {
			var result = LevelGen.createSkyMap(w, h);
			var count = [];
			var l = w * h;

			for (var i = 0; i < l; i++) {
				count[result[0][i] & 0xff]++;
			}
			if (count[Tile.cloud.id & 0xff] < 2000) continue;
			if (count[Tile.stairsDown.id & 0xff] < 2) continue;

			return result;
		} while (true);
	},

	createTopMap: function(w, h) {
		var mnoise1 = new LevelGen(w, h, 16);
		var mnoise2 = new LevelGen(w, h, 16);
		var mnoise3 = new LevelGen(w, h, 16);

		var noise1 = new LevelGen(w, h, 32);
		var noise2 = new LevelGen(w, h, 32);

		var map = [];
		var data = [];
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = x + y * w;

				var val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
				var mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
				mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

				var xd = x / (w - 1) * 2 - 1;
				var yd = y / (h - 1) * 2 - 1;
				if (xd < 0) xd = -xd;
				if (yd < 0) yd = -yd;
				var dist = xd >= yd ? xd : yd;
				dist = dist * dist * dist * dist;
				dist = dist * dist * dist * dist;
				val = val + 1 - dist * 20;

				if (val < -0.5) {
					map[i] = Tile.water.id;
				} else if (val > 0.5 && mval < 1.5) {
					map[i] = Tile.rock.id;
				} else {
					map[i] = Tile.grass.id;
				}
			}
		}

		for (var i = 0, l = w * h / 2800; i < l; i++) {
			var xs = random.nextInt(w);
			var ys = random.nextInt(h);
			for (var k = 0; k < 10; k++) {
				var x = xs + random.nextInt(21) - 10;
				var y = ys + random.nextInt(21) - 10;
				for (var j = 0; j < 100; j++) {
					var xo = x + random.nextInt(5) - random.nextInt(5);
					var yo = y + random.nextInt(5) - random.nextInt(5);
					for (var yy = yo - 1; yy <= yo + 1; yy++) {
						for (var xx = xo - 1; xx <= xo + 1; xx++) {
							if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
								if (map[xx + yy * w] == Tile.grass.id) {
									map[xx + yy * w] = Tile.sand.id;
								}
							}
						}
					}
				}
			}
		}


		for (var i = 0, l = w * h / 400; i < l; i++) {
			var x = random.nextInt(w);
			var y = random.nextInt(h);
			for (var j = 0; j < 200; j++) {
				var xx = x + random.nextInt(15) - random.nextInt(15);
				var yy = y + random.nextInt(15) - random.nextInt(15);
				if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
					if (map[xx + yy * w] == Tile.grass.id) {
						map[xx + yy * w] = Tile.tree.id;
					}
				}
			}
		}

		for (var i = 0, l = w * h / 400; i < l; i++) {
			var x = random.nextInt(w);
			var y = random.nextInt(h);
			var col = random.nextInt(4);
			for (var j = 0; j < 30; j++) {
				var xx = x + random.nextInt(5) - random.nextInt(5);
				var yy = y + random.nextInt(5) - random.nextInt(5);
				if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
					if (map[xx + yy * w] == Tile.grass.id) {
						map[xx + yy * w] = Tile.flower.id;
						data[xx + yy * w] = (col + random.nextInt(4) * 16);
					}
				}
			}
		}

		for (var i = 0, l = w * h / 100; i < l; i++) {
			var xx = random.nextInt(w);
			var yy = random.nextInt(h);
			if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
				if (map[xx + yy * w] == Tile.sand.id) {
					map[xx + yy * w] = Tile.cactus.id;
				}
			}
		}

		var count = 0;
		stairsLoop: for (var i = 0, l = w * h / 100; i < l; i++) {
			var x = random.nextInt(w - 2) + 1;
			var y = random.nextInt(h - 2) + 1;

			for (var yy = y - 1; yy <= y + 1; yy++) {
				for (var xx = x - 1; xx <= x + 1; xx++) {
					if (map[xx + yy * w] != Tile.rock.id) continue stairsLoop;
				}
			}

			map[x + y * w] = Tile.stairsDown.id;
			count++;
			if (count == 4) break;
		}

		return [ map, data ];
	},

	createUndergroundMap: function(w, h, depth) {
		var mnoise1 = new LevelGen(w, h, 16);
		var mnoise2 = new LevelGen(w, h, 16);
		var mnoise3 = new LevelGen(w, h, 16);

		var nnoise1 = new LevelGen(w, h, 16);
		var nnoise2 = new LevelGen(w, h, 16);
		var nnoise3 = new LevelGen(w, h, 16);

		var wnoise1 = new LevelGen(w, h, 16);
		var wnoise2 = new LevelGen(w, h, 16);
		var wnoise3 = new LevelGen(w, h, 16);

		var noise1 = new LevelGen(w, h, 32);
		var noise2 = new LevelGen(w, h, 32);

		var map = [];
		var data = [];
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = x + y * w;

				var val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

				var mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
				mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

				var nval = Math.abs(nnoise1.values[i] - nnoise2.values[i]);
				nval = Math.abs(nval - nnoise3.values[i]) * 3 - 2;

				var wval = Math.abs(wnoise1.values[i] - wnoise2.values[i]);
				wval = Math.abs(nval - wnoise3.values[i]) * 3 - 2;

				var xd = x / (w - 1.0) * 2 - 1;
				var yd = y / (h - 1.0) * 2 - 1;
				if (xd < 0) xd = -xd;
				if (yd < 0) yd = -yd;
				var dist = xd >= yd ? xd : yd;
				dist = dist * dist * dist * dist;
				dist = dist * dist * dist * dist;
				val = val + 1 - dist * 20;

				if (val > -2 && wval < -2.0 + (depth) / 2 * 3) {
					if (depth > 2)
						map[i] = Tile.lava.id;
					else
						map[i] = Tile.water.id;
				} else if (val > -2 && (mval < -1.7 || nval < -1.4)) {
					map[i] = Tile.dirt.id;
				} else {
					map[i] = Tile.rock.id;
				}
			}
		}

		var r = 2;
		for (var i = 0, l = i < w * h / 400; i < l; i++) {
			var x = random.nextInt(w);
			var y = random.nextInt(h);
			for (var j = 0; j < 30; j++) {
				var xx = x + random.nextInt(5) - random.nextInt(5);
				var yy = y + random.nextInt(5) - random.nextInt(5);
				if (xx >= r && yy >= r && xx < w - r && yy < h - r) {
					if (map[xx + yy * w] == Tile.rock.id) {
						map[xx + yy * w] = ((Tile.ironOre.id & 0xff) + depth - 1);
					}
				}
			}
		}

		if (depth < 3) {
			var count = 0;
			stairsLoop: for (var i = 0, l = w * h / 100; i < l; i++) {
				var x = random.nextInt(w - 20) + 10;
				var y = random.nextInt(h - 20) + 10;

				for (var yy = y - 1; yy <= y + 1; yy++)
					for (var xx = x - 1; xx <= x + 1; xx++) {
						if (map[xx + yy * w] != Tile.rock.id) continue stairsLoop;
					}

				map[x + y * w] = Tile.stairsDown.id;
				count++;
				if (count == 4) break;
			}
		}

		return [ map, data ];
	},

	createSkyMap: function(w, h) {
		var noise1 = new LevelGen(w, h, 8);
		var noise2 = new LevelGen(w, h, 8);

		var map = [];
		var data = [];
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var i = x + y * w;

				var val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

				var xd = x / (w - 1.0) * 2 - 1;
				var yd = y / (h - 1.0) * 2 - 1;
				if (xd < 0) xd = -xd;
				if (yd < 0) yd = -yd;
				var dist = xd >= yd ? xd : yd;
				dist = dist * dist * dist * dist;
				dist = dist * dist * dist * dist;
				val = -val * 1 - 2.2;
				val = val + 1 - dist * 20;

				if (val < -0.25) {
					map[i] = Tile.infiniteFall.id;
				} else {
					map[i] = Tile.cloud.id;
				}
			}
		}

		stairsLoop: for (var i = 0, l = w * h / 50; i < l; i++) {
			var x = random.nextInt(w - 2) + 1;
			var y = random.nextInt(h - 2) + 1;

			for (var yy = y - 1; yy <= y + 1; yy++)
				for (var xx = x - 1; xx <= x + 1; xx++) {
					if (map[xx + yy * w] != Tile.cloud.id) continue stairsLoop;
				}

			map[x + y * w] = Tile.cloudCactus.id;
		}

		var count = 0;
		stairsLoop: for (var i = 0; i < w * h; i++) {
			var x = random.nextInt(w - 2) + 1;
			var y = random.nextInt(h - 2) + 1;

			for (var yy = y - 1; yy <= y + 1; yy++)
				for (var xx = x - 1; xx <= x + 1; xx++) {
					if (map[xx + yy * w] != Tile.cloud.id) continue stairsLoop;
				}

			map[x + y * w] = Tile.stairsDown.id;
			count++;
			if (count == 2) break;
		}

		return [ map, data ];
	},

	main: function(args) {
		var d = 0;
		while (true) {
			var w = 128;
			var h = 128;

			var map = LevelGen.createAndValidateTopMap(w, h)[0];
			// var map = LevelGen.createAndValidateUndergroundMap(w, h, (d++ % 3) + 1)[0];
			// var map = LevelGen.createAndValidateSkyMap(w, h)[0];

			var img = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
			var pixels = [];
			for (var y = 0; y < h; y++) {
				for (var x = 0; x < w; x++) {
					var i = x + y * w;

					if (map[i] == Tile.water.id) pixels[i] = 0x000080;
					if (map[i] == Tile.grass.id) pixels[i] = 0x208020;
					if (map[i] == Tile.rock.id) pixels[i] = 0xa0a0a0;
					if (map[i] == Tile.dirt.id) pixels[i] = 0x604040;
					if (map[i] == Tile.sand.id) pixels[i] = 0xa0a040;
					if (map[i] == Tile.tree.id) pixels[i] = 0x003000;
					if (map[i] == Tile.lava.id) pixels[i] = 0xff2020;
					if (map[i] == Tile.cloud.id) pixels[i] = 0xa0a0a0;
					if (map[i] == Tile.stairsDown.id) pixels[i] = 0xffffff;
					if (map[i] == Tile.stairsUp.id) pixels[i] = 0xffffff;
					if (map[i] == Tile.cloudCactus.id) pixels[i] = 0xff00ff;
				}
			}
			img.setRGB(0, 0, w, h, pixels, 0, w);
			if (confirm("Another?")) {
				console.log('LevelGen', img);
			}
		}
	}

});







// public class LevelGen {
// 	private static final Random random = new Random();
// 	public double[] values;
// 	private int w, h;

// 	public LevelGen(int w, int h, int featureSize) {
// 		this.w = w;
// 		this.h = h;

// 		values = new double[w * h];

// 		for (int y = 0; y < w; y += featureSize) {
// 			for (int x = 0; x < w; x += featureSize) {
// 				setSample(x, y, random.nextFloat() * 2 - 1);
// 			}
// 		}

// 		int stepSize = featureSize;
// 		double scale = 1.0 / w;
// 		double scaleMod = 1;
// 		do {
// 			int halfStep = stepSize / 2;
// 			for (int y = 0; y < w; y += stepSize) {
// 				for (int x = 0; x < w; x += stepSize) {
// 					double a = sample(x, y);
// 					double b = sample(x + stepSize, y);
// 					double c = sample(x, y + stepSize);
// 					double d = sample(x + stepSize, y + stepSize);

// 					double e = (a + b + c + d) / 4.0 + (random.nextFloat() * 2 - 1) * stepSize * scale;
// 					setSample(x + halfStep, y + halfStep, e);
// 				}
// 			}
// 			for (int y = 0; y < w; y += stepSize) {
// 				for (int x = 0; x < w; x += stepSize) {
// 					double a = sample(x, y);
// 					double b = sample(x + stepSize, y);
// 					double c = sample(x, y + stepSize);
// 					double d = sample(x + halfStep, y + halfStep);
// 					double e = sample(x + halfStep, y - halfStep);
// 					double f = sample(x - halfStep, y + halfStep);

// 					double H = (a + b + d + e) / 4.0 + (random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
// 					double g = (a + c + d + f) / 4.0 + (random.nextFloat() * 2 - 1) * stepSize * scale * 0.5;
// 					setSample(x + halfStep, y, H);
// 					setSample(x, y + halfStep, g);
// 				}
// 			}
// 			stepSize /= 2;
// 			scale *= (scaleMod + 0.8);
// 			scaleMod *= 0.3;
// 		} while (stepSize > 1);
// 	}

// 	private double sample(int x, int y) {
// 		return values[(x & (w - 1)) + (y & (h - 1)) * w];
// 	}

// 	private void setSample(int x, int y, double value) {
// 		values[(x & (w - 1)) + (y & (h - 1)) * w] = value;
// 	}

// 	public static byte[][] createAndValidateTopMap(int w, int h) {
// 		int attempt = 0;
// 		do {
// 			byte[][] result = createTopMap(w, h);

// 			int[] count = new int[256];

// 			for (int i = 0; i < w * h; i++) {
// 				count[result[0][i] & 0xff]++;
// 			}
// 			if (count[Tile.rock.id & 0xff] < 100) continue;
// 			if (count[Tile.sand.id & 0xff] < 100) continue;
// 			if (count[Tile.grass.id & 0xff] < 100) continue;
// 			if (count[Tile.tree.id & 0xff] < 100) continue;
// 			if (count[Tile.stairsDown.id & 0xff] < 2) continue;

// 			return result;

// 		} while (true);
// 	}

// 	public static byte[][] createAndValidateUndergroundMap(int w, int h, int depth) {
// 		int attempt = 0;
// 		do {
// 			byte[][] result = createUndergroundMap(w, h, depth);

// 			int[] count = new int[256];

// 			for (int i = 0; i < w * h; i++) {
// 				count[result[0][i] & 0xff]++;
// 			}
// 			if (count[Tile.rock.id & 0xff] < 100) continue;
// 			if (count[Tile.dirt.id & 0xff] < 100) continue;
// 			if (count[(Tile.ironOre.id & 0xff) + depth - 1] < 20) continue;
// 			if (depth < 3) if (count[Tile.stairsDown.id & 0xff] < 2) continue;

// 			return result;

// 		} while (true);
// 	}

// 	public static byte[][] createAndValidateSkyMap(int w, int h) {
// 		int attempt = 0;
// 		do {
// 			byte[][] result = createSkyMap(w, h);

// 			int[] count = new int[256];

// 			for (int i = 0; i < w * h; i++) {
// 				count[result[0][i] & 0xff]++;
// 			}
// 			if (count[Tile.cloud.id & 0xff] < 2000) continue;
// 			if (count[Tile.stairsDown.id & 0xff] < 2) continue;

// 			return result;

// 		} while (true);
// 	}

// 	private static byte[][] createTopMap(int w, int h) {
// 		LevelGen mnoise1 = new LevelGen(w, h, 16);
// 		LevelGen mnoise2 = new LevelGen(w, h, 16);
// 		LevelGen mnoise3 = new LevelGen(w, h, 16);

// 		LevelGen noise1 = new LevelGen(w, h, 32);
// 		LevelGen noise2 = new LevelGen(w, h, 32);

// 		byte[] map = new byte[w * h];
// 		byte[] data = new byte[w * h];
// 		for (int y = 0; y < h; y++) {
// 			for (int x = 0; x < w; x++) {
// 				int i = x + y * w;

// 				double val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;
// 				double mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
// 				mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

// 				double xd = x / (w - 1.0) * 2 - 1;
// 				double yd = y / (h - 1.0) * 2 - 1;
// 				if (xd < 0) xd = -xd;
// 				if (yd < 0) yd = -yd;
// 				double dist = xd >= yd ? xd : yd;
// 				dist = dist * dist * dist * dist;
// 				dist = dist * dist * dist * dist;
// 				val = val + 1 - dist * 20;

// 				if (val < -0.5) {
// 					map[i] = Tile.water.id;
// 				} else if (val > 0.5 && mval < -1.5) {
// 					map[i] = Tile.rock.id;
// 				} else {
// 					map[i] = Tile.grass.id;
// 				}
// 			}
// 		}

// 		for (int i = 0; i < w * h / 2800; i++) {
// 			int xs = random.nextInt(w);
// 			int ys = random.nextInt(h);
// 			for (int k = 0; k < 10; k++) {
// 				int x = xs + random.nextInt(21) - 10;
// 				int y = ys + random.nextInt(21) - 10;
// 				for (int j = 0; j < 100; j++) {
// 					int xo = x + random.nextInt(5) - random.nextInt(5);
// 					int yo = y + random.nextInt(5) - random.nextInt(5);
// 					for (int yy = yo - 1; yy <= yo + 1; yy++)
// 						for (int xx = xo - 1; xx <= xo + 1; xx++)
// 							if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
// 								if (map[xx + yy * w] == Tile.grass.id) {
// 									map[xx + yy * w] = Tile.sand.id;
// 								}
// 							}
// 				}
// 			}
// 		}

// 		/*
// 		 * for (int i = 0; i < w * h / 2800; i++) { int xs = random.nextInt(w); int ys = random.nextInt(h); for (int k = 0; k < 10; k++) { int x = xs + random.nextInt(21) - 10; int y = ys + random.nextInt(21) - 10; for (int j = 0; j < 100; j++) { int xo = x + random.nextInt(5) - random.nextInt(5); int yo = y + random.nextInt(5) - random.nextInt(5); for (int yy = yo - 1; yy <= yo + 1; yy++) for (int xx = xo - 1; xx <= xo + 1; xx++) if (xx >= 0 && yy >= 0 && xx < w && yy < h) { if (map[xx + yy * w] == Tile.grass.id) { map[xx + yy * w] = Tile.dirt.id; } } } } }
// 		 */

// 		for (int i = 0; i < w * h / 400; i++) {
// 			int x = random.nextInt(w);
// 			int y = random.nextInt(h);
// 			for (int j = 0; j < 200; j++) {
// 				int xx = x + random.nextInt(15) - random.nextInt(15);
// 				int yy = y + random.nextInt(15) - random.nextInt(15);
// 				if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
// 					if (map[xx + yy * w] == Tile.grass.id) {
// 						map[xx + yy * w] = Tile.tree.id;
// 					}
// 				}
// 			}
// 		}

// 		for (int i = 0; i < w * h / 400; i++) {
// 			int x = random.nextInt(w);
// 			int y = random.nextInt(h);
// 			int col = random.nextInt(4);
// 			for (int j = 0; j < 30; j++) {
// 				int xx = x + random.nextInt(5) - random.nextInt(5);
// 				int yy = y + random.nextInt(5) - random.nextInt(5);
// 				if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
// 					if (map[xx + yy * w] == Tile.grass.id) {
// 						map[xx + yy * w] = Tile.flower.id;
// 						data[xx + yy * w] = (byte) (col + random.nextInt(4) * 16);
// 					}
// 				}
// 			}
// 		}

// 		for (int i = 0; i < w * h / 100; i++) {
// 			int xx = random.nextInt(w);
// 			int yy = random.nextInt(h);
// 			if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
// 				if (map[xx + yy * w] == Tile.sand.id) {
// 					map[xx + yy * w] = Tile.cactus.id;
// 				}
// 			}
// 		}

// 		int count = 0;
// 		stairsLoop: for (int i = 0; i < w * h / 100; i++) {
// 			int x = random.nextInt(w - 2) + 1;
// 			int y = random.nextInt(h - 2) + 1;

// 			for (int yy = y - 1; yy <= y + 1; yy++)
// 				for (int xx = x - 1; xx <= x + 1; xx++) {
// 					if (map[xx + yy * w] != Tile.rock.id) continue stairsLoop;
// 				}

// 			map[x + y * w] = Tile.stairsDown.id;
// 			count++;
// 			if (count == 4) break;
// 		}

// 		return new byte[][] { map, data };
// 	}

// 	private static byte[][] createUndergroundMap(int w, int h, int depth) {
// 		LevelGen mnoise1 = new LevelGen(w, h, 16);
// 		LevelGen mnoise2 = new LevelGen(w, h, 16);
// 		LevelGen mnoise3 = new LevelGen(w, h, 16);

// 		LevelGen nnoise1 = new LevelGen(w, h, 16);
// 		LevelGen nnoise2 = new LevelGen(w, h, 16);
// 		LevelGen nnoise3 = new LevelGen(w, h, 16);

// 		LevelGen wnoise1 = new LevelGen(w, h, 16);
// 		LevelGen wnoise2 = new LevelGen(w, h, 16);
// 		LevelGen wnoise3 = new LevelGen(w, h, 16);

// 		LevelGen noise1 = new LevelGen(w, h, 32);
// 		LevelGen noise2 = new LevelGen(w, h, 32);

// 		byte[] map = new byte[w * h];
// 		byte[] data = new byte[w * h];
// 		for (int y = 0; y < h; y++) {
// 			for (int x = 0; x < w; x++) {
// 				int i = x + y * w;

// 				double val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

// 				double mval = Math.abs(mnoise1.values[i] - mnoise2.values[i]);
// 				mval = Math.abs(mval - mnoise3.values[i]) * 3 - 2;

// 				double nval = Math.abs(nnoise1.values[i] - nnoise2.values[i]);
// 				nval = Math.abs(nval - nnoise3.values[i]) * 3 - 2;

// 				double wval = Math.abs(wnoise1.values[i] - wnoise2.values[i]);
// 				wval = Math.abs(nval - wnoise3.values[i]) * 3 - 2;

// 				double xd = x / (w - 1.0) * 2 - 1;
// 				double yd = y / (h - 1.0) * 2 - 1;
// 				if (xd < 0) xd = -xd;
// 				if (yd < 0) yd = -yd;
// 				double dist = xd >= yd ? xd : yd;
// 				dist = dist * dist * dist * dist;
// 				dist = dist * dist * dist * dist;
// 				val = val + 1 - dist * 20;

// 				if (val > -2 && wval < -2.0 + (depth) / 2 * 3) {
// 					if (depth > 2)
// 						map[i] = Tile.lava.id;
// 					else
// 						map[i] = Tile.water.id;
// 				} else if (val > -2 && (mval < -1.7 || nval < -1.4)) {
// 					map[i] = Tile.dirt.id;
// 				} else {
// 					map[i] = Tile.rock.id;
// 				}
// 			}
// 		}

// 		{
// 			int r = 2;
// 			for (int i = 0; i < w * h / 400; i++) {
// 				int x = random.nextInt(w);
// 				int y = random.nextInt(h);
// 				for (int j = 0; j < 30; j++) {
// 					int xx = x + random.nextInt(5) - random.nextInt(5);
// 					int yy = y + random.nextInt(5) - random.nextInt(5);
// 					if (xx >= r && yy >= r && xx < w - r && yy < h - r) {
// 						if (map[xx + yy * w] == Tile.rock.id) {
// 							map[xx + yy * w] = (byte) ((Tile.ironOre.id & 0xff) + depth - 1);
// 						}
// 					}
// 				}
// 			}
// 		}

// 		if (depth < 3) {
// 			int count = 0;
// 			stairsLoop: for (int i = 0; i < w * h / 100; i++) {
// 				int x = random.nextInt(w - 20) + 10;
// 				int y = random.nextInt(h - 20) + 10;

// 				for (int yy = y - 1; yy <= y + 1; yy++)
// 					for (int xx = x - 1; xx <= x + 1; xx++) {
// 						if (map[xx + yy * w] != Tile.rock.id) continue stairsLoop;
// 					}

// 				map[x + y * w] = Tile.stairsDown.id;
// 				count++;
// 				if (count == 4) break;
// 			}
// 		}

// 		return new byte[][] { map, data };
// 	}

// 	private static byte[][] createSkyMap(int w, int h) {
// 		LevelGen noise1 = new LevelGen(w, h, 8);
// 		LevelGen noise2 = new LevelGen(w, h, 8);

// 		byte[] map = new byte[w * h];
// 		byte[] data = new byte[w * h];
// 		for (int y = 0; y < h; y++) {
// 			for (int x = 0; x < w; x++) {
// 				int i = x + y * w;

// 				double val = Math.abs(noise1.values[i] - noise2.values[i]) * 3 - 2;

// 				double xd = x / (w - 1.0) * 2 - 1;
// 				double yd = y / (h - 1.0) * 2 - 1;
// 				if (xd < 0) xd = -xd;
// 				if (yd < 0) yd = -yd;
// 				double dist = xd >= yd ? xd : yd;
// 				dist = dist * dist * dist * dist;
// 				dist = dist * dist * dist * dist;
// 				val = -val * 1 - 2.2;
// 				val = val + 1 - dist * 20;

// 				if (val < -0.25) {
// 					map[i] = Tile.infiniteFall.id;
// 				} else {
// 					map[i] = Tile.cloud.id;
// 				}
// 			}
// 		}

// 		stairsLoop: for (int i = 0; i < w * h / 50; i++) {
// 			int x = random.nextInt(w - 2) + 1;
// 			int y = random.nextInt(h - 2) + 1;

// 			for (int yy = y - 1; yy <= y + 1; yy++)
// 				for (int xx = x - 1; xx <= x + 1; xx++) {
// 					if (map[xx + yy * w] != Tile.cloud.id) continue stairsLoop;
// 				}

// 			map[x + y * w] = Tile.cloudCactus.id;
// 		}

// 		int count = 0;
// 		stairsLoop: for (int i = 0; i < w * h; i++) {
// 			int x = random.nextInt(w - 2) + 1;
// 			int y = random.nextInt(h - 2) + 1;

// 			for (int yy = y - 1; yy <= y + 1; yy++)
// 				for (int xx = x - 1; xx <= x + 1; xx++) {
// 					if (map[xx + yy * w] != Tile.cloud.id) continue stairsLoop;
// 				}

// 			map[x + y * w] = Tile.stairsDown.id;
// 			count++;
// 			if (count == 2) break;
// 		}

// 		return new byte[][] { map, data };
// 	}

// 	public static void main(String[] args) {
// 		int d = 0;
// 		while (true) {
// 			int w = 128;
// 			int h = 128;

// 			byte[] map = LevelGen.createAndValidateTopMap(w, h)[0];
// 			// byte[] map = LevelGen.createAndValidateUndergroundMap(w, h, (d++ % 3) + 1)[0];
// 			// byte[] map = LevelGen.createAndValidateSkyMap(w, h)[0];

// 			BufferedImage img = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
// 			int[] pixels = new int[w * h];
// 			for (int y = 0; y < h; y++) {
// 				for (int x = 0; x < w; x++) {
// 					int i = x + y * w;

// 					if (map[i] == Tile.water.id) pixels[i] = 0x000080;
// 					if (map[i] == Tile.grass.id) pixels[i] = 0x208020;
// 					if (map[i] == Tile.rock.id) pixels[i] = 0xa0a0a0;
// 					if (map[i] == Tile.dirt.id) pixels[i] = 0x604040;
// 					if (map[i] == Tile.sand.id) pixels[i] = 0xa0a040;
// 					if (map[i] == Tile.tree.id) pixels[i] = 0x003000;
// 					if (map[i] == Tile.lava.id) pixels[i] = 0xff2020;
// 					if (map[i] == Tile.cloud.id) pixels[i] = 0xa0a0a0;
// 					if (map[i] == Tile.stairsDown.id) pixels[i] = 0xffffff;
// 					if (map[i] == Tile.stairsUp.id) pixels[i] = 0xffffff;
// 					if (map[i] == Tile.cloudCactus.id) pixels[i] = 0xff00ff;
// 				}
// 			}
// 			img.setRGB(0, 0, w, h, pixels, 0, w);
// 			JOptionPane.showMessageDialog(null, null, "Another", JOptionPane.YES_NO_OPTION, new ImageIcon(img.getScaledInstance(w * 4, h * 4, Image.SCALE_AREA_AVERAGING)));
// 		}
// 	}
// }

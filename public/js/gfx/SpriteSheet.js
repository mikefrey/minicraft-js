// package com.mojang.ld22.gfx;

// import java.awt.image.BufferedImage;


class SpriteSheet {
	constructor(image) {
		this.width = image.width;
		this.height = image.height;
	  this.image = image;
		this.pixels = null;

		this.pixels = image.getData(0, 0, this.width, this.height);
		// var px = image.getData(0, 0, this.width, this.height);
		// for (var i = 0; i < px.length; i+=4) {
		// 	this.pixels.push(px[i+3] / 64);
		// }
	}
}


// public class SpriteSheet {
// 	public int width, height;
// 	public int[] pixels;

// 	public SpriteSheet(BufferedImage image) {
// 		width = image.getWidth();
// 		height = image.getHeight();
// 		pixels = image.getRGB(0, 0, width, height, null, 0, width);
// 		for (int i = 0; i < pixels.length; i++) {
// 			pixels[i] = (pixels[i] & 0xff) / 64;
// 		}
// 	}
// }

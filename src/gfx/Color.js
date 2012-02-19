// package com.mojang.ld22.gfx;

var Color = (function(){

	function getChannel(d) {
		if (d < 0) return 255;
		var r = d / 100 % 10;
		var g = d / 10 % 10;
		var b = d % 10;
		return r * 36 + g * 6 + b;
	}

	function get(a, b, c, d) {
		return (getChannel(d) << 24) + (getChannel(c) << 16) + (getChannel(b) << 8) + (getChannel(a));
	}

	return {
		get: get,
		getChannel: getChannel
	}
})();


// public class Color {

// 	public static int get(int a, int b, int c, int d) {
// 		return (get(d) << 24) + (get(c) << 16) + (get(b) << 8) + (get(a));
// 	}

// 	public static int get(int d) {
// 		if (d < 0) return 255;
// 		int r = d / 100 % 10;
// 		int g = d / 10 % 10;
// 		int b = d % 10;
// 		return r * 36 + g * 6 + b;
// 	}

// }
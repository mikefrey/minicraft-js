// package com.mojang.ld22.gfx;

class Color {

	static getChannel(d) {
		if (d < 0) return 255
		const r = Math.floor(d / 100) % 10
		const g = Math.floor(d / 10) % 10
		const b = d % 10
		const out = r * 36 + g * 6 + b
		//console.log(d, out)
		return out
	}

	static get(a, b, c, d) {
		return (Color.getChannel(d) << 24) +
						(Color.getChannel(c) << 16) +
						(Color.getChannel(b) << 8) +
						(Color.getChannel(a))
	}
}

// var Color = (function(){
//
// 	function getChannel(d) {
// 		if (d < 0) return 255
// 		var r = Math.floor(d / 100) % 10
// 		var g = Math.floor(d / 10) % 10
// 		var b = d % 10
// 		var out = r * 36 + g * 6 + b
// 		//console.log(d, out)
// 		return out
// 	}
//
// 	function get(a, b, c, d) {
// 		return (getChannel(d) << 24) + (getChannel(c) << 16) + (getChannel(b) << 8) + (getChannel(a))
// 	}
//
// 	return {
// 		get: get,
// 		getChannel: getChannel
// 	}
// })();


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

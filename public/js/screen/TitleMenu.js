// package com.mojang.ld22.screen;

// import com.mojang.ld22.gfx.Color;
// import com.mojang.ld22.gfx.Font;
// import com.mojang.ld22.gfx.Screen;
// import com.mojang.ld22.sound.Sound;

class TitleMenu extends Menu {

  constructor() {
    super()
    this.selected = 0
    this.options = ['Start game', 'How to play', 'About']
  }

  tick() {
		const input = this.input
		if (input.up.clicked) this.selected--
		if (input.down.clicked) this.selected++

		const len = this.options.length
		if (this.selected < 0) this.selected += len
		if (this.selected >= len) this.selected -= len

		if (input.attack.clicked || input.menu.clicked) {
			if (this.selected == 0) {
				Sound.test.play()
				this.game.resetGame()
				this.game.setMenu(null)
			}
			if (this.selected == 1) this.game.setMenu(new InstructionsMenu(this))
			if (this.selected == 2) this.game.setMenu(new AboutMenu(this))
		}
	}

  render(screen) {
		screen.clear(0);

		const h = 2;
		const w = 13;
		const titleColor = Color.get(0, 10, 131, 551);
		const xo = (screen.w - w * 8) / 2 | 0;
		const yo = 24;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				screen.render(xo + x * 8, yo + y * 8, x + (y + 6) * 32, titleColor, 0);
			}
		}

		for (let i = 0; i < 3; i++) {
			let msg = this.options[i];
			let col = Color.get(0, 222, 222, 222);
			if (i == this.selected) {
				msg = `> ${msg} <`;
				col = Color.get(0, 555, 555, 555);
			}
			Font.draw(msg, screen, (screen.w - msg.length * 8) / 2 | 0, (8 + i) * 8, col);
		}

		Font.draw('(Arrow keys, X and C)', screen, 0, screen.h - 8, Color.get(0, 111, 111, 111));
	}
}



// public class TitleMenu extends Menu {
// 	private int selected = 0;

// 	private static final String[] options = { "Start game", "How to play", "About" };

// 	public TitleMenu() {
// 	}

// 	public void tick() {
// 		if (input.up.clicked) selected--;
// 		if (input.down.clicked) selected++;

// 		int len = options.length;
// 		if (selected < 0) selected += len;
// 		if (selected >= len) selected -= len;

// 		if (input.attack.clicked || input.menu.clicked) {
// 			if (selected == 0) {
// 				Sound.test.play();
// 				game.resetGame();
// 				game.setMenu(null);
// 			}
// 			if (selected == 1) game.setMenu(new InstructionsMenu(this));
// 			if (selected == 2) game.setMenu(new AboutMenu(this));
// 		}
// 	}

// 	public void render(Screen screen) {
// 		screen.clear(0);

// 		int h = 2;
// 		int w = 13;
// 		int titleColor = Color.get(0, 010, 131, 551);
// 		int xo = (screen.w - w * 8) / 2;
// 		int yo = 24;
// 		for (int y = 0; y < h; y++) {
// 			for (int x = 0; x < w; x++) {
// 				screen.render(xo + x * 8, yo + y * 8, x + (y + 6) * 32, titleColor, 0);
// 			}
// 		}

// 		for (int i = 0; i < 3; i++) {
// 			String msg = options[i];
// 			int col = Color.get(0, 222, 222, 222);
// 			if (i == selected) {
// 				msg = "> " + msg + " <";
// 				col = Color.get(0, 555, 555, 555);
// 			}
// 			Font.draw(msg, screen, (screen.w - msg.length() * 8) / 2, (8 + i) * 8, col);
// 		}

// 		Font.draw("(Arrow keys,X and C)", screen, 0, screen.h - 8, Color.get(0, 111, 111, 111));
// 	}
// }

import InGame from "./scenes/inGame";
import {BootScene} from "./scenes/BootScene";

// A class is used here, so that the canvas is not displayed on the screen instantly
// which would hide the spinner
class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super({
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: "gameContainer",
        width: 800,
        height: 600,
      },
      fps: { smoothStep: false },
      backgroundColor: 0x000000,
    });

    // Add all the scenes
    this.scene.add("boot", BootScene);
  }
}

new Game().scene.start("boot");

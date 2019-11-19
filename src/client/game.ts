import 'phaser'
import { BootScene } from "./scenes/boot-scene";
import { MenuScene } from './scenes/menu-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game',
  scene: [BootScene, MenuScene],
}

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }

  preload(): void {
    this.boot;
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});

//const game = new Game(config)

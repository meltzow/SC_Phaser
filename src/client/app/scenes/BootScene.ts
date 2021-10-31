import Phaser from "phaser";

import InGame from "./inGame";

export class BootScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    create ()
    {
        this.add.text(100, 100, 'Click to start the game');

        this.input.once('pointerdown', () => {
        
            this.scene.add('myScene', InGame, true, { x: 400, y: 300 });
            this.scene.remove("boot")

        }, this);
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

}
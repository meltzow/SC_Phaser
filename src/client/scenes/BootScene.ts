import InGame from "./InGame";

export class BootScene extends Phaser.Scene {

    create ()
    {
        this.add.text(0, 0, 'Click to add new Scene');

        this.input.once('pointerdown', () => {
        
            this.scene.add('myScene', InGame, true, { x: 400, y: 300 });

        }, this);
    }

}
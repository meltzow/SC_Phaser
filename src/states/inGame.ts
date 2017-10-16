import * as Assets from '../assets';
import {BaseSystem} from "../systems/BaseSystem";
import {MotionSystem} from "../systems/MotionSystem";
import {EntityUtils} from "../entities/EntityUtils";
import {Motion} from "../components/Motion";
import {Entity} from "../entities/Entity";
import {EventBus} from "../events/EventBus";
import {KeyInputEvent} from "../events/KeyInputEvent";
import {CameraSystem} from "../systems/CameraSystem";
import {AssetSystem} from "../systems/AssetSystem";
import {KeyboardInputSystem} from "../systems/KeyboardInputSystem";
import {Camera} from "../components/Camera";
import {Player} from "../components/Player";

export default class InGame extends Phaser.State {
    levelData = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]];

    isoGroup: Phaser.Group;
    cursors: Phaser.CursorKeys;
    //player: Phaser.Plugin.Isometric.IsoSprite;

    systems: BaseSystem[] = []

    preload() {
        this.game.plugins.add(Phaser.Plugin.Isometric);
        // Start the IsoArcade physics system.
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.systems.push(new MotionSystem());
        this.systems.push(new CameraSystem());
        this.systems.push(new AssetSystem());
        this.systems.push(new KeyboardInputSystem());
        this.registerSystemsForListener(this.systems);
    }


    registerSystemsForListener(systems: BaseSystem[]) {

    }

    public create(): void {
        let map = {
            visual: {
                image: Assets.Spritesheets.SpritesheetsOverlord848472
            },
            data: [
                [1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1]
            ]
        };
        let overlord = EntityUtils.createEntity();
        overlord.addComponent(new Motion({speed: 10, acceleration: 10, facing: "west"}));

        var player = EntityUtils.createEntity();
        player.addComponent(new Player());
        player.addComponent(new Camera({maxSpeed: 4}));

        // Create a group for our tiles.
        this.isoGroup = this.game.add.group();

        // Set the global gravity for IsoArcade.
        this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        //TODO: this must be refactored into a sprite SpriteSystem
        // Create another cube as our 'player', and set it up just like the cubes above.
        var overloard = (this.game.add as any).isoSprite(128, 128, 0, Assets.Spritesheets.SpritesheetsOverlord848472.getName(), 0, this.isoGroup);
        overloard.data = {entity: overlord.id};
        overloard.tint = 0x86bfda;
        overloard.anchor.set(0.5);
        this.game.physics.isoArcade.enable(overloard);
        overloard.body.collideWorldBounds = true;

        // Set up our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.systems.forEach((system: BaseSystem) => {
            system.create(this.game);
        });
    }



    spawnTiles() {
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = (this.game.add as any).isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }

    update() {
        // Move the player at this speed.
        if (this.cursors.up.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.UP}))
        } else if (this.cursors.down.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.DOWN}))
        }
        if (this.cursors.left.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.LEFT}))
        } else if (this.cursors.right.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.RIGHT}))
        }

        this.systems.forEach((system: BaseSystem) => {
            system.update(this.game);
        });

        // Our collision and sorting code again.
        // this.game.physics.isoArcade.collide(this.isoGroup);
        //this.game.iso.topologicalSort(isoGroup);
    }


}

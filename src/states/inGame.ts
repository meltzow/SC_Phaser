import * as Assets from '../assets';
import {BaseSystem} from '../systems/BaseSystem';
import {EntityUtils} from '../entities/EntityUtils';
import {EventBus} from '../events/EventBus';
import {KeyInputEvent} from '../events/KeyInputEvent';
import {CameraSystem} from '../systems/CameraSystem';
import {KeyboardInputSystem} from '../systems/KeyboardInputSystem';
import {Camera} from '../components/Camera';
import {Player} from '../components/Player';
import * as MouseInput from '../components/MouseInput';
import {MotionSystem} from '../systems/MotionSystem';
import {MouseInputSystem} from '../systems/MouseInputSystem';
import {Position} from '../components/Position';
import {Motion} from '../components/Motion';
import {Map} from '../components/Map';
import {Entity} from '../entities/Entity';

export default class InGame extends Phaser.State {

    // isoGroup: Phaser.Group;
    cursors: Phaser.CursorKeys;
    // player: Phaser.Plugin.Isometric.IsoSprite;

    systems: BaseSystem[] = [];

    preload() {
        this.game.plugins.add(Phaser.Plugin.Isometric);
        // Start the IsoArcade physics system.
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.systems.push(new MotionSystem());
        //this.systems.push(new CameraSystem());
        // this.systems.push(new AssetSystem());
        //this.systems.push(new KeyboardInputSystem());
        this.systems.push(new MouseInputSystem());
        this.registerSystemsForListener(this.systems);
    }


    registerSystemsForListener(systems: BaseSystem[]) {

    }

    public create(): void {
        let map1 = EntityUtils.createEntity();
        let mapComp = new Map();
        map1.addOrUpdateComponent(mapComp);


        let overlordEnt = EntityUtils.createEntity();
        // overlord.addComponent(new Motion({speed: 10, acceleration: 10, facing: "west"}));
        let overlordPos = new Position({x: 1, y: 5, z: 0});
        overlordEnt.addOrUpdateComponent(overlordPos);
        overlordEnt.addOrUpdateComponent(new Motion());

        let player = EntityUtils.createEntity();
        player.addOrUpdateComponent(new Player());
        player.addOrUpdateComponent(new Camera({maxSpeed: 4}));


        // Create a group for our tiles.
        // this.isoGroup = this.game.add.group();

        // Set the global gravity for IsoArcade.
        this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

        // Let's make a load of tiles on a grid.
        this.spawnTiles(mapComp);

        // TODO: this must be refactored into a sprite SpriteSystem
        // Create another cube as our 'player', and set it up just like the cubes above.
        let overlordSprite = this.game.add.isoSprite(overlordPos.x * 38, overlordPos.y * 38, overlordPos.z, Assets.Spritesheets.SpritesheetsOverlord848472.getName(), 0, this.world);
        overlordSprite.data = {entity: overlordEnt.id};
        overlordSprite.tint = 0x86bfda;
        overlordSprite.anchor.set(0.5);

        this.game.physics.isoArcade.enable(overlordSprite);
        overlordSprite.body.collideWorldBounds = true;
        let foundOverlord = this.world.filter((child) => {
            return (child as any).data && (child as any).data.entity && (child as any).data.entity === overlordEnt.id;
        });
        this.game.camera.bounds = new Phaser.Rectangle(0, 0, 1600, 1200);

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


    spawnTiles(mapComp: Map) {
        let width = 10;
        let length = 10;
        mapComp.data = [];
        let tile;
        for (let xx = 0; xx < width; xx += 1) {
            mapComp.data[xx] = [];
            for (let yy = 0; yy < length; yy += 1) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = this.game.add.isoSprite(xx * 38, yy * 38, 0, 'tile', 0, this.world);
                tile.anchor.set(0.5, 0);
                mapComp.data[xx][yy] = 0;
            }
        }
    }

    update() {
        // Move the player at this speed.
        if (this.cursors.up.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.UP}));
        } else if (this.cursors.down.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.DOWN}));
        }
        if (this.cursors.left.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.LEFT}));
        } else if (this.cursors.right.isDown) {
            EventBus.post(new KeyInputEvent({keyCode: Phaser.Keyboard.RIGHT}));
        }
        if (this.game.input.mousePointer.leftButton.isDown) {

            
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            let currentPlayer = EntityUtils.findEntities(Player)[0];
            currentPlayer.addOrUpdateComponent(new MouseInput.MouseInput({
                button: MouseInput.BUTTON.LEFT,
                x: this.game.input.mousePointer.x,
                y: this.game.input.mousePointer.y
            }));

            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            this.world.forEach((tile) => {
                let cursorPos = this.game.iso.unproject(this.game.input.activePointer.position);
                let inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                // If it does, do a little animation and tint change.
                if (!tile.selected && inBounds) {
                    tile.selected = true;
                    tile.tint = 0x86bfda;
                    this.game.add.tween(tile).to({isoZ: 4}, 200, Phaser.Easing.Quadratic.InOut, true);
                }
                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    tile.tint = 0xffffff;
                    this.game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
                }
            }, {});

        }

        // Our collision and sorting code again.
        // this.game.physics.isoArcade.collide(this.isoGroup);
        // this.game.iso.topologicalSort(isoGroup);


        this.nextTick();
    }

    nextTick() {
        for (var idx3 in EntityUtils.entities) {
            var ent3 = EntityUtils.entities[idx3]
            this.systems.forEach((system: BaseSystem) => {
                let founds = EntityUtils.findEntities(system.components[0], system.components[1],system.components[2]);
                if (!founds || founds.length === 0) {
                    return;
                }
                
                founds.forEach((entity) => {
                    // FIXME: find all changes in entities
                    system.onEntityEachTick(this.game, entity);
                    console.log("tick for " + system + " with entity " + entity.toString())
                });
            });
        }
        EntityUtils.applyChanges();
    }

    render() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }

}

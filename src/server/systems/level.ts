import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import {Component, System, World} from "@colyseus/ecs";
import {Unit, UnitTypes} from "../../shared/components/Unit";
import {Position} from "../../shared/components/Position";
import {Velocity} from "../../shared/components/Velocity";
import {Speed} from "../../shared/components/Speed";
import {Rotation} from "../../shared/components/Rotation";
import {Sprite, SpriteTextures} from "../../shared/components/Sprite";
import {Commandable} from "../../shared/components/Commandable";
import {Selectable} from "../../shared/components/Selectable";
import {Level} from "../../shared/components/Level";

export function preloadLevelSystem(scene: Phaser.Scene) {
    const mapName = 'assets/tilemaps/cross.json'
    console.log("Loading map ", mapName);
    scene.load.tilemapTiledJSON('map', mapName);
    // scene.load.image('tile1', 'assets/tilesets/tilea4.png');
    // scene.load.image('tiel1a', 'assets/tilesets/tilea1.png');
    // scene.load.image('tile2', 'assets/tilesets/tilea2.png');
    scene.load.image('desert', 'assets/tilesets/desert.png');
    scene.load.image('objects', 'assets/tilesets/objects.png');

    //   game.load.tilemap('map', 'assets/tilemaps/chip-forest2.json', null, Phaser.Tilemap.TILED_JSON);
    //     game.load.image('chip-forest2', 'assets/tilesets/chip-forest2.png');

}

export default function createLevelSystem(scene: Phaser.Scene, game: Phaser.Game, world: World,references: {map: Tilemap, layer: Phaser.Tilemaps.TilemapLayer} ) {

    return class LevelSystem extends System {

        static queries = {
            entities: {
                components: [Level]
            },
        };

        PLAYER_ID = 0

        init() {
            this.create()
            this.loadObjects()
        }

        loadObjects() {
            console.log("Map ", references.map);
            for (let y = 0; y < references.map.height; y++)
                for (let x = 0; x < references.map.width; x++) {
                    const tile = references.map.getTileAt(x, y, false, 'objects');
                    let unitId
                    if (tile) switch (tile.index - 1) {
                        case -1:
                            //its empty
                            break;
                        //Main player (0) = the green one in tileset objects
                        case 1:
                        case 7:
                        case 13:
                            unitId = world.createEntity()
                                .addComponent(Unit)
                                .addComponent(Position)
                                .addComponent(Velocity)
                                .addComponent(Speed)
                                .addComponent(Rotation)

                            const position = unitId.getMutableComponent(Position)
                            position!.x = (x * references.map.tileWidth)
                            position!.y = (y * references.map.tileHeight)
                            const unit = unitId.getMutableComponent(Unit)
                            // unit!.ID = unitId
                            unit!.playerId = this.PLAYER_ID
                            unit!.type = UnitTypes.player
                            unit!.maxLife = 10
                            unit!.life = 10

                            unitId.addComponent(Sprite)
                            const sprite = unitId.getMutableComponent(Sprite)
                            sprite!.texture = SpriteTextures.Link
                            unitId.addComponent(Selectable)
                            unitId.addComponent(Commandable)
                            break;

                        // case 18:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 0);break;
                        // case 24:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 1);break;
                        // case 30:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 2);break;

                        // //Player 1
                        // case 1: Unit.new(x * tileSize, y * tileSize, 1, 0); break;
                        // case 7: Unit.new(x * tileSize, y * tileSize, 1, 1); break;
                        // case 13: Unit.new(x * tileSize, y * tileSize, 1, 2); break;
                        //
                        // case 19:  Building.new(x * tileSize, y * tileSize, 1, 0);break;
                        // case 25:  Building.new(x * tileSize, y * tileSize, 1, 1);break;
                        // case 31:  Building.new(x * tileSize, y * tileSize, 1, 2);break;
                        //
                        // // Player 2
                        // case 2: Unit.new(x * tileSize, y * tileSize, 2, 0); break;
                        // case 8: Unit.new(x * tileSize, y * tileSize, 2, 1); break;
                        // case 14: Unit.new(x * tileSize, y * tileSize, 2, 2); break;
                        //
                        // case 20:  Building.new(x * tileSize, y * tileSize, 2, 0);break;
                        // case 26:  Building.new(x * tileSize, y * tileSize, 2, 1);break;
                        // case 32:  Building.new(x * tileSize, y * tileSize, 2, 2);break;

                        //Player 3
                        // case 3: Unit.new(x * tileSize, y * tileSize, 3, 0); break;
                        // case 9: Unit.new(x * tileSize, y * tileSize, 3, 1); break;
                        // case 15: Unit.new(x * tileSize, y * tileSize, 3, 2); break;
                        //
                        // case 21:  Building.new(x * tileSize, y * tileSize, 3, 0);break;
                        // case 27:  Building.new(x * tileSize, y * tileSize, 3, 1);break;
                        // case 33:  Building.new(x * tileSize, y * tileSize, 3, 2);break;

                        //Landmarks
                        // case 5: star = {x: x * tileSize, y: y * tileSize}; break;
                        // case 11: landmark = {x: x * tileSize, y: y * tileSize}; break;
                        //
                        // //resources
                        // case 4: Resource.new(x * tileSize, y * tileSize, 0); break;
                        // case 10: Resource.new(x * tileSize, y * tileSize, 1); break;
                        // case 16: Resource.new(x * tileSize, y * tileSize, 2); break;

                        default:
                            console.warn("Found Unexpected " + (tile.index) + " at " + x + "x" + y);
                    }
                }
        }


        create() {

            // Create tilemap from json
            references.map = scene.make.tilemap({key: 'map'});
            const levelEnt = world.createEntity()
            levelEnt.addComponent(Level)

            const level = levelEnt.getMutableComponent(Level)
            level!.tileheight = references.map.tileHeight
            level!.tilewidth = references.map.tileWidth
            level!.width = references.map.width
            level!.height = references.map.height
            // var tileset1 = map.addTilesetImage('desert', 'tile1');
            // const tileset2 = map.addTilesetImage('tiel1a', 'tiel1a');
            // const tileset3 = map.addTilesetImage('tile2', 'tile2');
            const tilesetGround = references.map.addTilesetImage('desert', 'desert');
            const tilesetObjects = references.map.addTilesetImage('objects', 'objects');

            references.layer = references.map.createLayer('ground', [tilesetGround]);
            // references.map.createLayer('objects', [tilesetObjects]);

            // const animatedLayer = map.createLayer('ground-animated', map.getTileset('map'));
            // if (animatedLayer) scene.time.events.loop(LAYER_ANIMATION, function(){
            // 	animatedLayer.visible = !animatedLayer.visible;
            // });

            // Level.data[level] = Uint8Array.from(layer.data.values)

            // layer.resizeWorld();
            // layer.debug = Game.debug;
            // Game.map = map;

        }

        execute(delta: number, time: number): void {
        }

        // function update() {
        // 	if (Game.status != GameStatus.play) return;
        //
        // 	function callUpdate(object){ object.update(); }
        // 	Utils.allResources().forEach(callUpdate);
        // 	Utils.allUnits().forEach(callUpdate);
        // 	Utils.allBuildings().forEach(callUpdate);
        //
        // 	Controls.update();
        // 	LevelLogic.update();
        //
        // }
        // function render() {
        // 	if (Game.status != GameStatus.play) return;
        //
        // 	function callRender(object){ object.render(); }
        // 	Global.selectedUnits[PLAYER_ID].forEach(callRender);
        // 	//TODO resource
        // 	//TODO building
        //
        // 	Controls.render();
        // 	LevelLogic.render();
        // 	HUD.render();
        //
        // 	Utils.render(); //For rendering progrss bars
        // }

        //
        // };
    }
}

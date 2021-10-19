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
        }

        execute(delta: number, time: number): void {
        }
    }
}

import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import {Component, System, World} from "@colyseus/ecs";
import {Unit, UnitTypes} from "../../common/components/Unit";
import {Position} from "../../common/components/Position";
import {Velocity} from "../../common/components/Velocity";
import {Speed} from "../../common/components/Speed";
import {Rotation} from "../../common/components/Rotation";
import {Sprite, SpriteTextures} from "../../common/components/Sprite";
import {Commandable} from "../../common/components/Commandable";
import {Selectable} from "../../common/components/Selectable";
import {Level} from "../../common/components/Level";
import {preloadLevelSystemCommon} from "../../common/systems/level";

export function preloadLevelSystem(scene: Phaser.Scene) {
    preloadLevelSystemCommon(scene)
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

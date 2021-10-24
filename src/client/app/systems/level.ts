import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import {System} from "@colyseus/ecs";
import {Level} from "../../../common/components/Level";
import {preloadLevelSystemCommon} from "../../../common/systems/level";

export function preloadLevelSystem(scene: Phaser.Scene) {
    preloadLevelSystemCommon(scene)
    console.log("client preloadLevelSystem")
}

export default function createLevelSystem(scene: Phaser.Scene, references: {map: Tilemap, layer: Phaser.Tilemaps.TilemapLayer} ) {

    return class LevelSystem extends System {

        static queries = {
            entities: {
                components: [Level]
            },
        };

        PLAYER_ID = 0

        init() {
            this.create()
        }

       create() {

            // Create tilemap from json
            references.map = scene.make.tilemap({key: 'map'});
            const tilesetGround = references.map.addTilesetImage('desert', 'desert');

            references.layer = references.map.createLayer('ground', [tilesetGround]);
            console.log("creating map")
        }

        execute(delta: number, time: number): void {
        }
    }
}

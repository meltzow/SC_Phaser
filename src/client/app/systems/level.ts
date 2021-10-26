import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import {System} from "@colyseus/ecs";
import {Level} from "../../../common/components/Level";

export function preloadLevelSystem(scene: Phaser.Scene) {
    const mapName = 'assets/tilemaps/cross.json'
    console.log("client loads map: ", mapName);
    scene.load.tilemapTiledJSON('map', mapName);
    // scene.load.image('tile1', 'assets/tilesets/tilea4.png');
    // scene.load.image('tiel1a', 'assets/tilesets/tilea1.png');
    // scene.load.image('tile2', 'assets/tilesets/tilea2.png');
    scene.load.image('desert', 'assets/tilesets/desert.png');
    scene.load.image('objects', 'assets/tilesets/objects.png');
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

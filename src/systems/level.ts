import Phaser from 'phaser'
import {
    defineSystem,
    defineQuery, addEntity, IWorld, addComponent,
} from 'bitecs'

import Level from "../components/Level";
import Tilemap = Phaser.Tilemaps.Tilemap;
import Unit, {UnitTypes} from "../components/Unit";
import Position from "../components/Position";
import Rotation from "../components/Rotation";
import Sprite, {SpriteTextures} from "../components/Sprite";
import Selectable from "../components/Selectable"
import Commandable from "../components/Commandable";
import Velocity from "../components/Velocity";
import Speed from "../components/Speed";

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

export default function createLevelSystem(scene: Phaser.Scene, game: Phaser.Game, world: IWorld,references: {map: Tilemap, layer: Phaser.Tilemaps.TilemapLayer} ) {

    // let LevelLogic: { map: any; preload: () => void; create: () => void; start: () => void; update: () => void; render: () => void };
    const levelQuery = defineQuery([Level])
    // const debugTile1 = debugTile()
    // debugPath: debugPath
    // worldToTile: worldToTile
    const PLAYER_ID = 0

    function loadObjects() {
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
                        unitId = addEntity(world)
                        addComponent(world, Unit, unitId)
                        addComponent(world, Position, unitId)
                        addComponent(world, Velocity, unitId)
                        addComponent(world, Speed, unitId)
                        addComponent(world, Rotation, unitId)
                        Position.x[unitId] = (x * references.map.tileWidth )
                        Position.y[unitId] = (y * references.map.tileHeight)
                        Unit.ID[unitId] = unitId
                        Unit.playerId[unitId] = PLAYER_ID
                        Unit.type[unitId] = UnitTypes.player
                        Unit.maxLife[unitId] = 10
                        Unit.life[unitId] = 10
                        addComponent(world, Sprite, unitId)
                        Sprite.texture[unitId] = SpriteTextures.Link
                        addComponent(world, Selectable, unitId)
                        addComponent(world, Commandable, unitId)
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

                    default: console.warn("Found Unexpected " + (tile.index) + " at " + x + "x" + y);
                }
            }
    }


    function create() {

        // Create tilemap from json
        references.map = scene.make.tilemap({key: 'map'});
        const level = addEntity(world)
        addComponent(world, Level, level)
        Level.tileheight[level] = references.map.tileHeight
        Level.tilewidth[level] = references.map.tileWidth
        Level.width[level] = references.map.width
        Level.height[level] = references.map.height
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

    create()
    loadObjects()

    return defineSystem((world) => {
        // const entities = levelQuery(world)

        // init()

        return world
    })
}

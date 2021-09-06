import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
} from 'bitecs'

import CPU from '../components/CPU'
import Velocity from '../components/Velocity'
import Rotation from '../components/Rotation'
import Input, { Direction} from '../components/Input'
import Level from "../components/Level";
import Game, {GameStatus} from "../components/Game";
import Tilemap = Phaser.Tilemaps.Tilemap;
import {utils} from "./utils";

export function preloadLevelSystem(scene: Phaser.Scene){
	const mapName = 'assets/tilemaps/cross.json'
	console.log("Loading map ", mapName);
	scene.load.tilemapTiledJSON('map', mapName);
	scene.load.image('tile1', 'assets/tilesets/tilea4.png');
	scene.load.image('tiel1a', 'assets/tilesets/tilea1.png');
	scene.load.image('tile2', 'assets/tilesets/tilea2.png');
	scene.load.image('desert', 'assets/tilesets/desert.png');

	//   game.load.tilemap('map', 'assets/tilemaps/chip-forest2.json', null, Phaser.Tilemap.TILED_JSON);
	//     game.load.image('chip-forest2', 'assets/tilesets/chip-forest2.png');

}

export default function createLevelSystem(scene: Phaser.Scene, game: Phaser.Game) {
	//Private variables
	let map: Tilemap,
		layer: Phaser.Tilemaps.TilemapLayer;
	// let LevelLogic: { map: any; preload: () => void; create: () => void; start: () => void; update: () => void; render: () => void };
	const levelQuery = defineQuery([Level])
	// const debugTile1 = debugTile()
	// debugPath: debugPath
	// worldToTile: worldToTile



		function create() {

			// Create tilemap from json
			map = scene.make.tilemap({key: 'map'});
			var tileset1 = map.addTilesetImage('desert', 'tile1');
			// const tileset2 = map.addTilesetImage('tiel1a', 'tiel1a');
			// const tileset3 = map.addTilesetImage('tile2', 'tile2');
			// const tileset4 = map.addTilesetImage('desert', 'desert');

			layer = map.createLayer('ground', tileset1);
			// const animatedLayer = map.createLayer('ground-animated', map.getTileset('map'));
			// if (animatedLayer) scene.time.events.loop(LAYER_ANIMATION, function(){
			// 	animatedLayer.visible = !animatedLayer.visible;
			// });

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

	return defineSystem((world) => {
		// const entities = levelQuery(world)

		// init()

		return world
	})
}

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

export default function createLevelSystem(scene: Phaser.Scene, game: Phaser.Game) {
	//Private variables
	let map: Tilemap,
		layer: Phaser.Tilemaps.TilemapLayer;
	let LevelLogic: { map: any; preload: () => void; create: () => void; start: () => void; update: () => void; render: () => void };
	const levelQuery = defineQuery([Level])
	// const debugTile1 = debugTile()
	// debugPath: debugPath
	// worldToTile: worldToTile

	function worldToTile(x: any, y: any) {
		return [Math.max(0, layer.getTileX(x)), Math.max(0, layer.getTileY(y)) ];
	}

	function debugPath(path: any[], enable: any){
		if (Game.debug) {
			path.forEach(function(p) {
				map.getTile(p.x, p.y).debug = enable;
			});
			layer.dirty = true;
		}
	}
	function debugTile(x: any, y: any, enable: any) {
		if (Game.debug) {
			map.getTile(x, y).debug = enable;
			layer.dirty = true;
		}
	}

	function loadObjects() {
		const enemyId = 1;
		const map = game.map;
		const tileSize = map.tileWidth;
		console.log("Map ", map);
		for (let y = 0; y < map.height; y++)
			for (let x = 0; x < map.width; x++) {
				const tile = map.getTile(x, y, 'objects');
				if (tile) switch (tile.index-1 ) {

					//Main player (0)
					case 0:  Unit.new(x * tileSize, y * tileSize, PLAYER_ID, 0);break;
					case 6:  Unit.new(x * tileSize, y * tileSize, PLAYER_ID, 1);break;
					case 12:  Unit.new(x * tileSize, y * tileSize, PLAYER_ID, 2);break;

					case 18:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 0);break;
					case 24:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 1);break;
					case 30:  Building.new(x * tileSize, y * tileSize, PLAYER_ID, 2);break;

					//Player 1
					case 1: Unit.new(x * tileSize, y * tileSize, 1, 0); break;
					case 7: Unit.new(x * tileSize, y * tileSize, 1, 1); break;
					case 13: Unit.new(x * tileSize, y * tileSize, 1, 2); break;

					case 19:  Building.new(x * tileSize, y * tileSize, 1, 0);break;
					case 25:  Building.new(x * tileSize, y * tileSize, 1, 1);break;
					case 31:  Building.new(x * tileSize, y * tileSize, 1, 2);break;

					// Player 2
					case 2: Unit.new(x * tileSize, y * tileSize, 2, 0); break;
					case 8: Unit.new(x * tileSize, y * tileSize, 2, 1); break;
					case 14: Unit.new(x * tileSize, y * tileSize, 2, 2); break;

					case 20:  Building.new(x * tileSize, y * tileSize, 2, 0);break;
					case 26:  Building.new(x * tileSize, y * tileSize, 2, 1);break;
					case 32:  Building.new(x * tileSize, y * tileSize, 2, 2);break;

					//Player 3
					case 3: Unit.new(x * tileSize, y * tileSize, 3, 0); break;
					case 9: Unit.new(x * tileSize, y * tileSize, 3, 1); break;
					case 15: Unit.new(x * tileSize, y * tileSize, 3, 2); break;

					case 21:  Building.new(x * tileSize, y * tileSize, 3, 0);break;
					case 27:  Building.new(x * tileSize, y * tileSize, 3, 1);break;
					case 33:  Building.new(x * tileSize, y * tileSize, 3, 2);break;

					//Landmarks
					case 5: star = {x: x * tileSize, y: y * tileSize}; break;
					case 11: landmark = {x: x * tileSize, y: y * tileSize}; break;

					//resources
					case 4: Resource.new(x * tileSize, y * tileSize, 0); break;
					case 10: Resource.new(x * tileSize, y * tileSize, 1); break;
					case 16: Resource.new(x * tileSize, y * tileSize, 2); break;

					default: console.warn("Found Unexpected " + (tile.index) + " at " + x + "x" + y);
				}
			}
	}


	//Public functions
	// return {
	// 	function init(//_levelLogic) {
	// 		Global.status = "play";
	//
	// 		game = Global.game;
	// 		Global.level = this;
	// 		LevelLogic = _levelLogic;
	//
	// 		HUD.init();
	// 		Controls.init();
	// 		AI.init(1); //playerId = 1
	// 	}
		function preload() {

			console.log("Loading map ", LevelLogic.map);
			scene.load.tilemapTiledJSON('map', LevelLogic.map, null);
			scene.load.image('tile1', 'assets/tilesets/tilea4.png');
			scene.load.image('tiel1a', 'assets/tilesets/tilea1.png');
			scene.load.image('tile2', 'assets/tilesets/tilea2.png');
			scene.load.image('desert', 'assets/tilesets/desert.png');

			//   game.load.tilemap('map', 'assets/tilemaps/chip-forest2.json', null, Phaser.Tilemap.TILED_JSON);
			//     game.load.image('chip-forest2', 'assets/tilesets/chip-forest2.png');

			Unit.preload();
			HUD.preload();
			Building.preload();
			Dialog.preload();
			LevelLogic.preload();
		}

		function create() {

			// Create tilemap from json
			map = scene.add.tilemap('map');
			map.addTilesetImage('tile1', 'tile1');
			map.addTilesetImage('tiel1a', 'tiel1a');
			map.addTilesetImage('tile2', 'tile2');
			map.addTilesetImage('desert', 'desert');

			layer = map.createLayer('ground', map.getTileset('map'));
			var animatedLayer = map.createLayer('ground-animated');
			if (animatedLayer) game.time.events.loop(LAYER_ANIMATION, function(){
				animatedLayer.visible = !animatedLayer.visible;
			});

			layer.resizeWorld();
			layer.debug = Game.debug;
			Game.map = map;

			loadObjects();

			Controls.create();
			HUD.create();
			LevelLogic.create();
			AI.create();

			// Create all modules after being set by levellogic
			function callCreate(object){ object.create(); }
			Utils.allResources().forEach(callCreate);
			Utils.allUnits().forEach(callCreate);
			Utils.allBuildings().forEach(callCreate);

			console.log("Created units on level: ", Global.units);
			var firstUnitPos = Global.units[PLAYER_ID][0].properties();
			game.camera.focusOnXY(firstUnitPos.x, firstUnitPos.y); //Focus camera on first unit


			LevelLogic.start();
		}
		function update() {
			if (Game.status != GameStatus.play) return;

			function callUpdate(object){ object.update(); }
			Utils.allResources().forEach(callUpdate);
			Utils.allUnits().forEach(callUpdate);
			Utils.allBuildings().forEach(callUpdate);

			Controls.update();
			LevelLogic.update();

		}
		function render() {
			if (Game.status != GameStatus.play) return;

			function callRender(object){ object.render(); }
			Global.selectedUnits[PLAYER_ID].forEach(callRender);
			//TODO resource
			//TODO building

			Controls.render();
			LevelLogic.render();
			HUD.render();

			Utils.render(); //For rendering progrss bars
		}

	//
	// };


	return defineSystem((world) => {
		const entities = levelQuery(world)

		// init()
		preload()
		create()

		return world
	})
}

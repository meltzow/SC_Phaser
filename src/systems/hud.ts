import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
	IWorld
} from 'bitecs'

import Velocity from '../components/Velocity'
import Rotation from '../components/Rotation'
import Player from '../components/Player'
import Input, { Direction } from '../components/Input'
import Game, {UNIT_TYPES} from "../components/Game";
import Position from "../components/Position";

export default function createHudSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys, game: Phaser.Game, scene: Phaser.Scene) {
	const playerQuery = defineQuery([Player, Input])

	//Private variables
	// let game: { width: any; height: any; world: { x: number; y: number } };
	const style = {font: "32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

	let resourceTexts: Phaser.GameObjects.Text[] = []
	const createBuildings: { visible: boolean }[] = [];

	const MINIMAP_WIDTH = 100;
	const MINIMAP_HEIGHT = 100;

	const mapSizeX = 1, mapSizeY = 1;

	let MINIMAP_X: number, MINIMAP_Y: number;
	//  var minimapBase;
	let minimapUnits: { context: { clearRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void }; rect: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: string) => void; dirty: boolean };

	let shadowTexture: { context: { fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: any, arg3: any) => void; beginPath: () => void; arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number) => void; fill: () => void }; dirty: boolean },
		lightSprite: { x: number; y: number };

	function fullScreenToggle(){
		// if (game.scale.isFullScreen) game.scale.stopFullScreen();
		// else game.scale.startFullScreen(false);

	}

	function tintSprite(sprite: Phaser.GameObjects.Sprite, type: string | number) {
		switch (type) {
			case 0:
				sprite.tint = 0xaaffaa;
				break;
			case 1:
				sprite.tint = 0xffaaaa;
				break;
			case 2:
				sprite.tint = 0xaaaaff;
				break;
			case 3:
				sprite.tint = 0xffaaff;
				break;

			default:
				console.error("Undefined player id " + type);
		}
	}

	function createResources(){
		for (let type=0; type < UNIT_TYPES; type++){
			const x = scene.cameras.main.width - 250 + (type * 70);
			const y = 10;
			const text = scene.add.text(x + 30, y,  "2", style).setScrollFactor(0)
			resourceTexts.push(text);
			const sprite = scene.add.sprite(x, y, 'crystal');
			sprite.setScrollFactor(0)
			sprite.width = 32; sprite.height = 32;
			tintSprite(sprite, type);

		}
	}

	// function createMinimap(){
	// 	const miniMapBmd = game.make.bitmapData(MINIMAP_WIDTH, MINIMAP_HEIGHT); // g_game.miniMapSize is the pixel size in the minimap
	// 	const map = Global.map;
	// 	//TODO mapsize relative to map width, in order to fit the whole map in MINIMAP_WIDTH*H
	// 	mapSizeX = MINIMAP_WIDTH/ map.width;
	// 	mapSizeY = MINIMAP_HEIGHT/ map.height;
	// 	//  console.log("Map size ", map.width , map.height, mapSizeX, mapSizeY);
	// 	//Create minimap base with terrain info from map
	// 	// iterate my map layers
	// 	//for (l = 0; l < g_game.tileMap.layers.length; l++) { //only 1 layer
	// 	for (let y = 0; y < map.height; y++) {
	// 		for (let x = 0; x < map.width; x++) {
	// 			const tile = map.getTile(x, y/*, l*/);
	// 			//console.log("TILE ", tile);
	// 			if (tile /*&& g_game.tileMap.layers[l].name == 'Ground'*/) { //only 1 layer
	// 				//Minimap colouring
	// 				switch (tile.index){
	// 					case 98:  miniMapBmd.ctx.fillStyle = '#00b200'; break;
	// 					case 102: miniMapBmd.ctx.fillStyle = '#007f00';  break;
	// 					default: miniMapBmd.ctx.fillStyle = '#7f7f7f';
	// 				}
	// 				//miniMapBmd.ctx.fillStyle = '#bc8d6b';// fill a pixel in the minimap
	// 				miniMapBmd.ctx.fillRect(x * mapSizeX, y * mapSizeY, mapSizeX, mapSizeY);
	// 			}
	// 		}
	// 	}
	// 	//}
	// 	const minimapBase = scene.add.sprite(MINIMAP_X, MINIMAP_Y, miniMapBmd); // dynamic bmd where I draw mobile stuff like friends and enemies g_game.miniMapOverlay = this.game.add.bitmapData(g_game.tileMap.width*g_game.miniMapSize, g_game.tileMap.height*g_game.miniMapSize);this.game.add.sprite(g_game.miniMap.x, g_game.miniMap.y, g_game.miniMapOverlay);
	// 	minimapBase.fixedToCamera = true;
	//
	// 	//Create new bitmap for drawing units
	// 	minimapUnits = game.add.bitmapData(MINIMAP_WIDTH , MINIMAP_HEIGHT);
	// 	const minimapUnitSprite = scene.add.sprite(MINIMAP_X, MINIMAP_Y, minimapUnits);
	// 	minimapUnitSprite.fixedToCamera = true;
	//
	// }
	// function drawMinimap (){
	//
	// 	minimapUnits.context.clearRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);
	// 	const pixelSize = 2;
	//
	// 	const enemies = Global.enemyPlayerIds[0];
	//
	// 	//TODO loop over myUnits, show only visible units on map
	// 	Utils.allUnits().forEach(function(unit){
	//
	// 		const prop = unit.properties();
	// 		let playerColor;
	// 		if (prop.player == PLAYER_ID) playerColor = '#00ff00';
	// 		else if (enemies.indexOf(prop.player) != -1)playerColor = '#ff0000';
	// 		else playerColor = '#0000ff';
	//
	// 		const x = Math.floor(prop.x / Global.map.tileWidth);
	// 		const y = Math.floor(prop.y / Global.map.tileHeight);
	// 		minimapUnits.rect(x * mapSizeX, y * mapSizeY, pixelSize * mapSizeX, pixelSize* mapSizeY, playerColor);
	// 	});
	// 	minimapUnits.dirty = true;
	//
	// 	/*  g_game.soldiers.forEach(function(soldier) {
	//          g_game.miniMapOverlay.rect(Math.floor(soldier.x / TILE_SIZE) * g_game.miniMapSize, Math.floor(soldier.y / TILE_SIZE) * g_game.miniMapSize, g_game.miniMapSize, g_game.miniMapSize, color);
	//        });
	// */
	// }

	// function updateEnemyVisibility(){
	// 	//TODO optimize function, bit too heavy
	// 	const enemies = Utils.enemies(PLAYER_ID);
	// 	const resources = Utils.allResources();
	// 	const buildings = Utils.enemyBuildings(PLAYER_ID);
	//
	// 	function setVisible(object){object.setVisible(true);}
	//
	// 	if (Global.visibleMap){
	//
	// 		enemies.forEach(setVisible);
	// 		resources.forEach(setVisible);
	// 		buildings.forEach(setVisible);
	// 		return;
	// 	}
	//
	// 	//Set all to false
	// 	function setInvisible(object){object.setVisible(false);}
	// 	enemies.forEach(setInvisible);
	// 	resources.forEach(setInvisible);
	// 	buildings.forEach(setInvisible);
	//
	// 	//Set enemies to true if visible
	// 	function setVisibleIfClose(object) {
	// 		const unit = this;
	// 		const distance = Utils.distance(object.properties(), unit);
	// 		//console.log("Set object ", object, unit,  "visible", distance);
	// 		if (distance < unit.viewRange) object.setVisible(true);
	// 	}
	//
	// 	function setEnemiesVisible(myUnitProperties) {
	// 		enemies.forEach(setVisibleIfClose, myUnitProperties);
	// 		resources.forEach(setVisibleIfClose, myUnitProperties);
	// 		buildings.forEach(setVisibleIfClose, myUnitProperties);
	// 	}
	//
	// 	Global.units[PLAYER_ID].forEach(function(unit){
	// 		setEnemiesVisible(unit.properties());
	// 	});
	// }


	// function updateShadowTexture() {
	// 	//TODO optimize function, bit too heavy
	// 	if (Global.visibleMap){
	//
	// 		shadowTexture.context.fillStyle = 'rgb(255, 255, 255)';
	// 		shadowTexture.context.fillRect(0, 0, game.width, game.height);
	// 		shadowTexture.dirty = true;
	//
	// 		return;
	// 	}
	//
	// 	// Draw shadow
	// 	shadowTexture.context.fillStyle = 'rgb(220, 220, 220)';
	// 	shadowTexture.context.fillRect(0, 0, game.width, game.height);
	//
	// 	lightSprite.x = -game.world.x;
	// 	lightSprite.y = -game.world.y;
	//
	// 	// Intensity and size  of light fade every interval
	// 	const lightFadeAmount = 20;
	// 	const lightFadeSize = 10;
	// 	// Draw circle of light
	//
	// 	for (let i = 0; i < Global.units[PLAYER_ID].length; i++) {
	// 		const unit = Global.units[PLAYER_ID][i].properties();
	//
	// 		/*Fade DOESN'T WORK
	//         for (var r =0 ; r < 6; r++){
	//           var c = 1+( r *lightFadeAmount) ;
	//           shadowTexture.context.fillStyle = 'rgba('+c+', '+c +', '+c+', '+c+')';
	//           shadowTexture.context.beginPath();
	//           var viewRange = unit.viewRange + 50 - r* lightFadeSize;
	//           shadowTexture.context.arc(unit.x+game.world.x, unit.y+game.world.y, viewRange , 0, Math.PI*2);
	//           shadowTexture.context.fill();
	//         }*/
	// 		//var discrete = 10;
	// 		//var x = parseInt((unit.x + game.world.x) / discrete ) * discrete;
	// 		//var y = parseInt((unit.y + game.world.y) / discrete ) * discrete;
	// 		const x = unit.x + game.world.x;
	// 		const y = unit.y + game.world.y;
	// 		shadowTexture.context.fillStyle = 'rgba(255, 255, 255, 200)';
	// 		shadowTexture.context.beginPath();
	// 		shadowTexture.context.arc(x, y , unit.viewRange, 0, Math.PI * 2);
	// 		shadowTexture.context.fill();
	// 	}
	// 	// This just tells the engine it should update the texture cache
	// 	shadowTexture.dirty = true;
	// }

	// function updateSelectedUnitBuildings(){
	// 	for (let type=0; type < UNIT_TYPES; type++){
	// 		const typeUnits =  Utils.mySelectedUnits(type);
	// 		createBuildings[type].visible = typeUnits.length > 0;
	// 		TODO set disabled, not invisible and disable click
	// }
	// }

	//Public functions
	// return{
	function init() {
		resourceTexts = [];
		// game = Global.game;
		// MINIMAP_X = game.camera.width - MINIMAP_WIDTH - 10;
		// MINIMAP_Y = game.camera.height - MINIMAP_HEIGHT - 10;

	}
	function preload() {
		scene.load.image('crystal', 'assets/img/crystal-white.png');
		scene.load.image('fullscreen', 'assets/img/fullscreen.png');
	}

	function create() {

		const cursors = scene.input.keyboard.createCursorKeys();

		createResources();
		// 	createMinimap();
		// 	//full screen stuff
		// 	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		// 	game.scale.refresh();
		//
		// 	shadowTexture = game.add.bitmapData(game.width, game.height);
		// 	lightSprite = game.add.image(0, 0, shadowTexture);
		// 	lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
		// 	/*console.log("Blend modes ", Phaser.blendModes);
		//     game.time.events.loop(5000, function(){
		//       lightSprite.blendMode += 1;
		//     });*/
		//
		// 	// TODO use sprite instead of button
		// 	const button = screen.add.button(10, 10, 'fullscreen', fullScreenToggle);
		// 	button.setScrollFactor(0);
		//
		// 	// Use sprites instead of buttons to take advantage of PriorityID
		// 	//game.add.button(10, game.camera.height - 42, 'building', Controls.placeBuilding);
		// 	for (let type = 0; type < UNIT_TYPES; type++){
		// 		const build = scene.add.sprite(10 + (type * 32), scene.cameras.main.height - 42, 'castle-'+typeToName(type));
		// 		build.width=32; build.height=32;
		// 		build.inputEnabled = true;
		// 		build.events.onInputDown.add(Controls.clickBuilding );
		// 		build.type = type; //Used in clickBuilding
		// 		build.visible = false;
		//
		// 		build.fixedToCamera = true;
		// 		//Utils.tintSprite(build, type);
		// 		createBuildings.push(build);
		// 	}
		// 	//TODO Only show this when selected unit
		// 	//TODO different building types
		//
		// 	//Update resource texts
		// 	game.time.events.loop(1000, function(){
		// 		resourceTexts.forEach(function(rt, index){
		// 			rt.text = Global.resources[PLAYER_ID][index];
		// 		});
		// 	});
		//
		// 	//Not as heavy as using the update
		// 	game.time.events.loop(200, updateSelectedUnitBuildings);
		// 	if (!Global.visibleMap) game.time.events.loop(100, updateShadowTexture);
		// 	if (!Global.visibleMap) game.time.events.loop(100, updateEnemyVisibility);
		//
		// 	scene.time.events.loop(100, drawMinimap);
		//
		// 	//  build.priorityID = 20;
		// },
		// render: function(){
		// 	//  drawMinimap();
		// }

	}

	create()

	return defineSystem((world) => {

		const entities = playerQuery(world)
		const cam = scene.cameras.main;

		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]

			const direction = Input.direction[id]
			const speed = Input.speed[id]

			switch (direction)
			{
				case Direction.None:
					// cam.Velocity.x[id] = 0
					// Velocity.y[id] = 0
					break

				case Direction.Left:
					cam.x += speed
					break

				case Direction.Right:
					cam.x -= + speed
					break

				case Direction.Up:
					cam.y += speed
					break

				case Direction.Down:
					cam.y -=  speed
					break
			}
		}

	return world
})

}

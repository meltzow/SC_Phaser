import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery, IWorld
} from 'bitecs'

import Player from '../components/Player'
import Input from '../components/Input'
import {UNIT_TYPES} from "../components/Game";
import Camera = Phaser.Cameras.Scene2D.Camera;
import Level from "../components/Level";
import FixedKeyControl = Phaser.Cameras.Controls.FixedKeyControl;
import HUD from "../components/HUD";

export function preloadHudSystem(scene: Phaser.Scene) {
		scene.load.image('crystal', 'assets/img/crystal-white.png');
		scene.load.image('fullscreen', 'assets/img/fullscreen.png');
}

export default function createHudSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys, game: Phaser.Game, scene: Phaser.Scene, world: IWorld) {

	//TODO: something like this (https://phaser.io/examples/v3/view/camera/fixed-to-camera ) will  be great
	const style = {font: "32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

	const resourceTexts: Phaser.GameObjects.Text[] = []
	let cam: Camera
	let controls: FixedKeyControl


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
			const x = cam.width - 250 + (type * 70);
			const y = 10;
			const text = scene.add.text(x + 30, y,  "2", style).setScrollFactor(0)
			resourceTexts.push(text);

			const sprite = scene.add.sprite(x, y, 'crystal');
			sprite.setScrollFactor(0)
			sprite.setDisplaySize(32,32)
			tintSprite(sprite, type);

		}
	}


	function create() {
		cam = scene.cameras.main;
		createResources()

		const cursors = scene.input.keyboard.createCursorKeys();
		const controlConfig = {
			camera: scene.cameras.main,
			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			speed: 0.5
		};

		controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
	}

	function drawMiniMap() {
		const lq = defineQuery([Level])
		const levelId = lq(world)[0]

		const miniMap = scene.cameras.add(cam.width - 100, cam.height - 100, 90, 90, false, "minimap" )
		// miniMap.setAlpha(0.7)
		miniMap.zoom = 0.125 / 2
		miniMap.setBounds(0, 0, Level.width[levelId] * Level.tilewidth[levelId], Level.height[levelId] * Level.tileheight[levelId]);
	}

	create()
	drawMiniMap()

	const playerQuery = defineQuery([Player, Input, HUD])
	return defineSystem((world) => {

		const entities = playerQuery(world)

		const dt = scene.game.loop.delta
		controls.update(dt)
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]

			const direction = Input.direction[id]
			const speed = Input.speed[id]

			// switch (direction)
			// {
			// 	case Direction.None:
			// 		// cam.Velocity.x[id] = 0
			// 		// Velocity.y[id] = 0
			// 		break
			//
			// 	case Direction.Left:
			// 		cam.x += speed
			// 		break
			//
			// 	case Direction.Right:
			// 		cam.x -= speed
			// 		break
			//
			// 	case Direction.Up:
			// 		cam.y += speed
			// 		break
			//
			// 	case Direction.Down:
			// 		cam.y -=  speed
			// 		break
			// }


		}

	return world
})

}

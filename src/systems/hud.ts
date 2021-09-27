import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery, IWorld, Changed
} from 'bitecs'

import Player from '../components/Player'
import Input from '../components/Input'
import {UNIT_TYPES} from "../components/Game";
import Camera = Phaser.Cameras.Scene2D.Camera;
import Level from "../components/Level";
import FixedKeyControl = Phaser.Cameras.Controls.FixedKeyControl;
import HUD from "../components/HUD";
import Unit from "../components/Unit";
import Selectable from "../components/Selectable";
import {EventDispatcher} from "../events/EventDispatcher";
import SelectUnits from "../events/SelectUnits";
import UnitsSelected from "../events/UnitsSelected";
import Position from "../components/Position";

export function preloadHudSystem(scene: Phaser.Scene) {
		scene.load.image('crystal', 'assets/img/crystal-white.png');
		scene.load.image('fullscreen', 'assets/img/fullscreen.png');
}

export default function createHudSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys, game: Phaser.Game, scene: Phaser.Scene, world: IWorld, cam: Phaser.Cameras.Scene2D.Camera, spriteMap: Map<number, Phaser.GameObjects.Sprite>) {

	//TODO: something like this (https://phaser.io/examples/v3/view/camera/fixed-to-camera ) will  be great
	const style = {font: "32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

	const resourceTexts: Phaser.GameObjects.Text[] = []
	let controls: FixedKeyControl
	const id2lifebar: Map<number, Phaser.GameObjects.Rectangle> = new Map<number, Phaser.Geom.Rectangle>()

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

	function updateLifebar(id: number) {
		const lifeRect = id2lifebar.get(id)
		const sprite = spriteMap.get(id)
		if (lifeRect && sprite) {
			//Update life rectangle
			lifeRect.x = sprite.getTopLeft().x
			lifeRect.y = sprite.getTopLeft().y
			lifeRect.width = sprite.width / (Unit.maxLife[id] / Unit.life[id])
		}
	}

	function updateLifeBars(ids: Array<number>) {
		if (ids) {
			ids.forEach(id => {
				updateLifebar(id)
			})
		}

		// // Complete size bar with red life background (-width)
		// We can't overlap a rectangle with another without mixing their colors (right?)
		// lifeRectBackground.x = sprite.right ;
		// lifeRectBackground.y = sprite.bottom;
		// lifeRectBackground.width = lifeRect.width - sprite.width;
	}

	function updateSelections(ids: Array<number>) {
		id2lifebar.forEach((rect) => {
			rect.destroy()
		})
		//1. hole selectedUnit
		const playerQuery = defineQuery([Player])
		const playerIds = playerQuery(world)

		//2. foreach

		if (ids) {
			ids.forEach((unitId) => {
				const sprite = spriteMap.get(unitId)
				// @ts-ignore
				const lifeRect = scene.add.rectangle(sprite.x, sprite.bottom, sprite.width, 10)
				lifeRect.setStrokeStyle(1, 0xff119910)
				id2lifebar.set(unitId, lifeRect)
			})
			updateLifeBars(ids)
		}
		// Player.selectedUnits[playerIds[0]]
		}

		// Red background for life, set to width 0 on start
		// lifeRectBackground = new Phaser.Geom.Rectangle(sprite.right, sprite.bottom, 0, 10)




	function create() {
		createResources()

		const cursors = scene.input.keyboard.createCursorKeys();
		const controlConfig = {
			camera: scene.cameras.main,
			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			speed: 0.5,
			zoomIn: scene.input.keyboard.addKey('A'),
			zoomOut: scene.input.keyboard.addKey('Q')
		};

		controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)


		EventDispatcher.getInstance().on(UnitsSelected.name, (ctx: UnitsSelected) => {
			updateSelections(ctx.ids)
		})
	}

	function drawMiniMap() {
		const lq = defineQuery([Level])
		const levelId = lq(world)[0]

		const miniMap = scene.cameras.add(cam.width - 100, cam.height - 100, 90, 90, false, "minimap" )
		// miniMap.setAlpha(0.7)
		miniMap.zoom = 0.125 / 2
		miniMap.setBounds(0, 0, Level.width[levelId] * Level.tilewidth[levelId], Level.height[levelId] * Level.tileheight[levelId]);
	}


	// function render() {
	// 	graphics.strokeRectShape(dragRect)
	// }

	create()
	drawMiniMap()

	const unitQuery = defineQuery([Selectable, Changed(Position)])
	return defineSystem((world) => {

		const entities = unitQuery(world)

		const dt = scene.game.loop.delta
		controls.update(dt)
		const playerQuery = defineQuery([Player])
		const playerIds = playerQuery(world)
		const ids = Array.from(Player.selectedUnits[playerIds[0]]).filter(value => value > 0)

		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]
			if (ids.includes(id)) {
				updateLifebar(id)
			}
		}

	return world
})

}

import Phaser from 'phaser'
import {
	createWorld,
	addEntity,
	addComponent,
} from 'bitecs'

import type {
	IWorld,
	System
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Sprite, {SpriteTextures} from '../components/Sprite'
import Rotation from '../components/Rotation'
import Player from '../components/Player'
import CPU from '../components/CPU'
import Game1 from '../components/Game'

import createMovementSystem, {preloadMovementSystem} from '../systems/movement'
import createSpriteSystem, {preloadSpriteSystem} from '../systems/sprite'
import createInputSystem from '../systems/input'
import createCPUSystem from '../systems/cpu'
import createHudSystem, {preloadHudSystem} from "../systems/hud";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import createControlSystem from "../systems/controls";
import Unit from "../components/Unit";
import Selectable from "../components/Selectable";
import createDebugSystem from "../systems/debug";
import Speed from "../components/Speed";
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";




export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	private world!: IWorld
	private playerSystem!: System
	private cpuSystem!: System
	private movementSystem!: System
	private spriteSystem!: System
	private hudSystem!: System
	private levelSystem!: System
	private controlSystem!: System
	private debugSystem!: System

	private map!: Tilemap
	private groundLayer!: TilemapLayer

	rexBoard!: BoardPlugin
	board!: BoardPlugin.Board;
	print!: Phaser.GameObjects.Text;
	cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl
	private gameContainer!: HTMLElement;
	private eventEmitter: Phaser.Events.EventEmitter;

	constructor()
	{
		super('game')

		this.gameContainer = document.getElementById('game-container');
		this.eventEmitter = new Phaser.Events.EventEmitter();
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	preload()
    {
		preloadSpriteSystem(this)
		preloadLevelSystem(this)
		preloadHudSystem(this)
		preloadMovementSystem(this)

    }

    create()
    {
		const { width, height } = this.scale

        this.world = createWorld()

		//create Player Unit
		const knight = addEntity(this.world)

		addComponent(this.world, Position, knight)
		addComponent(this.world, Velocity, knight)
		addComponent(this.world, Speed, knight)
		addComponent(this.world, Rotation, knight)
		addComponent(this.world, Sprite, knight)
		addComponent(this.world, Game1, knight)
		// addComponent(this.world, Input, knight)
		Position.x[knight] = 200
		Position.y[knight] = 300
		Sprite.texture[knight] = SpriteTextures.Link
		// Input.speed[knight] = 10

		addComponent(this.world, Player, knight)
		Player.ID[knight] = 0
		// Input.speed[knight] = 5
		addComponent(this.world, Unit, knight)
		addComponent(this.world, Selectable, knight)

		// create random cpu tanks
		for (let i = 0; i < 2; ++i)
		{
			const tank = addEntity(this.world)

			addComponent(this.world, Position, tank)
			Position.x[tank] = Phaser.Math.Between(width * 0.25, width * 0.75)
			Position.y[tank] = Phaser.Math.Between(height * 0.25, height * 0.75)

			addComponent(this.world, Velocity, tank)
			addComponent(this.world, Rotation, tank)
			addComponent(this.world, Speed, tank)
			Speed.value[tank] = 10

			addComponent(this.world, Sprite, tank)
			Sprite.texture[tank] = Phaser.Math.Between(SpriteTextures.TankBlue, SpriteTextures.TankRed)

			addComponent(this.world, CPU, tank)
			CPU.timeBetweenActions[tank] = Phaser.Math.Between(0, 500)

			addComponent(this.world, Unit, tank)

			// addComponent(this.world, Input, tank)
			// Input.speed[tank] = 10
		}




		// create the systems
		const references = {map: this.map, layer: this.groundLayer}
		this.levelSystem = createLevelSystem(this, this.game, this.world, references)
		this.map = references.map
		this.groundLayer = references.layer
		this.playerSystem = createInputSystem(this.cursors)
		this.cpuSystem = createCPUSystem(this)
		this.hudSystem = createHudSystem(this.cursors, this.game, this, this.world)
		this.movementSystem = createMovementSystem(this.game, this, this.map, this.groundLayer, this.rexBoard)
		this.spriteSystem = createSpriteSystem(this, ['tank-blue', 'tank-green', 'tank-red','link'])
		this.controlSystem = createControlSystem(this, this.game, this.world)
		this.debugSystem = createDebugSystem(this)
    }

	update(time: number, delta: number) {
		// run each system in desired order
		this.playerSystem(this.world)
		this.cpuSystem(this.world)
		this.hudSystem(this.world)

		this.movementSystem(this.world)

		this.spriteSystem(this.world)
		this.controlSystem(this.world)
	}

	resizeGameContainer() {
		let winW = window.innerWidth / window.devicePixelRatio;
		let winH = window.innerHeight / window.devicePixelRatio;
		let breakpoints = [{ scrW: 0, gamW: 400 }, { scrW: 600, gamW: 450 }, { scrW: 900, gamW: 550 }, { scrW: 1200, gamW: 750 }, { scrW: 1500, gamW: 1000 }, { scrW: 1800, gamW: 1300 }];
		let currentBreakpoint = null;
		let newViewPortW = 0;
		let newViewPortH = 0;

		for (let i = 0; i < breakpoints.length; i++)
		{
			currentBreakpoint = breakpoints[i];

			if (winW < currentBreakpoint.scrW)
			{
				break;
			}
		}

		newViewPortW = currentBreakpoint.gamW;
		newViewPortH = currentBreakpoint.gamW * (winH / winW);

		this.game.scale.resize(newViewPortW, newViewPortH);

		// this.gameContainer.style.width = `${window.innerWidth}px`;
		// this.gameContainer.style.height = `${window.innerHeight}px`;
		// this.game.canvas.style.width = `${window.innerWidth}px`;
		// this.game.canvas.style.height = `${window.innerHeight}px`;

		this.eventEmitter.emit('screenResized');
	}

}

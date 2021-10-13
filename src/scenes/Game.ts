import Phaser from 'phaser'

import Game1 from '../components/Game'

import createMovementSystem, {preloadMovementSystem} from '../systems/movement'
import createSpriteSystem, {preloadSpriteSystem} from '../systems/sprite'
import createInputSystem from '../systems/input'
import createHudSystem, {preloadHudSystem} from "../systems/hud";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import createControlSystem from "../systems/controls";
import createDebugSystem from "../systems/debug";
import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {getControlSystem} from "../client/controlSystem";
import {InputComponent} from "../shared/components/InputComponent";
import {CanvasContext, Circle, DemoSettings, Intersecting, Movement, State} from "../shared/components/components";
import {Client} from "colyseus.js";
import {Player} from "../shared/components/Player";
import {DebugSystem} from "../shared/systems/DebugSystem";
import {SimulateInputSystem} from "../shared/systems/SimulateInputSystem";


export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	// private world!: World
	// private playerSystem!: System
	// private cpuSystem!: System
	// private movementSystem!: System
	// private spriteSystem!: System
	// private hudSystem!: System
	// private levelSystem!: System
	// private controlSystem!: System
	// private debugSystem!: System

	private map!: Tilemap
	private groundLayer!: TilemapLayer

	rexBoard!: BoardPlugin
	board!: BoardPlugin.Board;
	print!: Phaser.GameObjects.Text;
	cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl
	private gameContainer!: HTMLElement;
	private eventEmitter: Phaser.Events.EventEmitter;
	private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map<number, Phaser.GameObjects.Sprite>()
	// @ts-ignore
	private client: Client;
	private world: World | undefined;

	constructor()
	{
		super('game')

		// @ts-ignore
		this.gameContainer = document.getElementById('game-container');
		this.eventEmitter = new Phaser.Events.EventEmitter();

	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	preload()
    {
		//TODO
		// preloadSpriteSystem(this)
		// preloadLevelSystem(this)
		// preloadHudSystem(this)
		// preloadMovementSystem(this)

    }

    create() {
		this.world = new World();

		// const controlSystem = getControlSystem(this, this.game)
		this.client = new Client("ws://localhost:2567");

		// connect to colyseus' room
		this.client.joinOrCreate("my_room", {}, State).then(room => {
			console.log("game entities " + room.state.toConsole())
			//FIXME: this is not working. entities/components create by server are ignored/not found by queries
			this.world!.useEntities(room.state.entities);
			this.world!
				// .registerComponent(InputComponent)
				.registerComponent(Circle)
				.registerComponent(Movement)
				.registerComponent(Intersecting)
				.registerComponent(CanvasContext)
				.registerComponent(DemoSettings)
				.registerSystem(SimulateInputSystem)
			// .registerSystem(DebugSystem)

			let previousTime = Date.now();
			room.onStateChange((state) => {
				console.log("STATE CHANGE!" + state.toConsole());
				const now = Date.now();
				// this.world?.useEntities(state.entities)
				this.world!.execute(now - previousTime);
				previousTime = now;
			})
			room.onError((code, message) => console.log(message))
		})
	}

	update(time: number, delta: number) {
		// run each system in desired order
		// this.playerSystem(this.world)
		// // this.cpuSystem(this.world)
		// this.hudSystem(this.world)
		//
		// this.movementSystem(this.world)
		//
		// this.spriteSystem(this.world)
		// this.controlSystem(this.world)
		this.world!.execute(delta)
	}

	resizeGameContainer() {
		const winW = window.innerWidth / window.devicePixelRatio;
		const winH = window.innerHeight / window.devicePixelRatio;
		const breakpoints = [{ scrW: 0, gamW: 400 }, { scrW: 600, gamW: 450 }, { scrW: 900, gamW: 550 }, { scrW: 1200, gamW: 750 }, { scrW: 1500, gamW: 1000 }, { scrW: 1800, gamW: 1300 }];
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

		// @ts-ignore
		newViewPortW = currentBreakpoint.gamW;
		// @ts-ignore
		newViewPortH = currentBreakpoint.gamW * (winH / winW);

		this.game.scale.resize(newViewPortW, newViewPortH);

		// this.gameContainer.style.width = `${window.innerWidth}px`;
		// this.gameContainer.style.height = `${window.innerHeight}px`;
		// this.game.canvas.style.width = `${window.innerWidth}px`;
		// this.game.canvas.style.height = `${window.innerHeight}px`;

		this.eventEmitter.emit('screenResized');
	}

}

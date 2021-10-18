import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {State} from "../../shared/components/components";
import {Client} from "colyseus.js";
import {DebugSystem} from "../../shared/systems/DebugSystem";
import {registerComponents} from "../../shared/utils";
import {preloadLevelSystem} from "../systems/level";


export default class InGame extends Phaser.Scene
{
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
	private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map<number, Phaser.GameObjects.Sprite>()
	// @ts-ignore
	private client: Client;
	private world: World | undefined;

	constructor()
	{
		super('game')
	}

	preload()
    {
		//TODO
		// preloadSpriteSystem(this)
		preloadLevelSystem(this)
		// preloadHudSystem(this)
		// preloadMovementSystem(this)

    }

	create(scene: Phaser.Scene, game: Phaser.Game) {
		this.world = new World();

		registerComponents(this.world!)
 		this.world!.registerSystem(DebugSystem)


	}

	update(time: number, delta: number) {
		this.world!.execute(delta)
	}

}

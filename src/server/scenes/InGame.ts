import Phaser from 'phaser'

import Tilemap = Phaser.Tilemaps.Tilemap;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {System, World} from "@colyseus/ecs";
import {State} from "../../shared/components/components";
import {Client} from "colyseus.js";
import {DebugSystem} from "../../shared/systems/DebugSystem";
import {registerComponents} from "../../shared/utils";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import {getMovementSystem, preloadMovementSystem} from "../systems/MovementSystem";
import {InputSystem} from "../systems/InputSystem";


export default class InGame extends Phaser.Scene
{
	private map!: Tilemap
	private groundLayer!: TilemapLayer

	rexBoard!: BoardPlugin
	board!: BoardPlugin.Board;
	private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map<number, Phaser.GameObjects.Sprite>()
	private world: World | undefined;

	constructor()
	{
		super('game')
	}

	preload()
    {
		preloadLevelSystem(this)
		preloadMovementSystem(this)

    }

	create(data: { world: World }) {
		this.world = data.world

		const dataHolder = { map: this.map, layer: this.groundLayer, board: this.board, spriteMap: this.spriteMap}
		registerComponents(this.world)

		this.world.registerSystem(InputSystem)
		this.world!.registerSystem(DebugSystem)

		const level = createLevelSystem(this, this.game, this.world, dataHolder)
		this.world.registerSystem(level)

		this.map = dataHolder.map


		const mov = getMovementSystem(this.map, this.rexBoard, dataHolder)
		this.world.registerSystem(mov)


	}

	update(time: number, delta: number) {
		this.world!.execute(delta)
	}

}

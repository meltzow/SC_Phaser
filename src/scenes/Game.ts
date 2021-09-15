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
import Sprite from '../components/Sprite'
import Rotation from '../components/Rotation'
import Player from '../components/Player'
import CPU from '../components/CPU'
import Input from '../components/Input'
import Game1, {GameStatus} from '../components/Game'

import createMovementSystem from '../systems/movement'
import createSpriteSystem from '../systems/sprite'
import createPlayerSystem from '../systems/player'
import createCPUSystem from '../systems/cpu'
import createHudSystem, {preloadHudSystem} from "../systems/hud";
import createLevelSystem, {preloadLevelSystem} from "../systems/level";
import createControlSystem from "../systems/controls";
import Unit from "../components/Unit";
import Selectable from "../components/Selectable";
import createDebugSystem from "../systems/debug";
import Speed from "../components/Speed";

enum Textures
{
	TankBlue,
	TankGreen,
	TankRed,
	Link
}

export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	private world!: IWorld
	private playerSystem!: System
	private cpuSystem!: System
	private movementSystem!: System
	private spriteSystem!: System
	private hudSystem!: System
	private levelSystem!: System;
	private controlSystem!: System;
	private debugSystem!: System;

	constructor()
	{
		super('game')
	}

	init()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	preload()
    {
        this.load.image('tank-blue', 'assets/tank_blue.png')
		this.load.image('tank-green', 'assets/tank_green.png')
		this.load.image('tank-red', 'assets/tank_red.png')
		this.load.image('link','assets/animations/link/stand/001.png')

		preloadLevelSystem(this)
		preloadHudSystem(this)

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
		Sprite.texture[knight] = Textures.Link
		// Input.speed[knight] = 10

		addComponent(this.world, Player, knight)
		Player.ID[knight] = 0
		// Input.speed[knight] = 5
		addComponent(this.world, Unit, knight)
		addComponent(this.world, Selectable, knight)


		//TODO these attributes are PLAYER attributes, not for a unique game entity
		// Game1.resources = [[0,0,0], [0,0,0], [0,0,0], [0,0,0]]
		// Game1.levelResources = [[],[],[]]
		// Game1.visibleMap = false
		// Game1.selectedUnits = [[],[],[],[]] //List of all selected units
		// Game1.enemyPlayerIds = [[1,2,3],[0,2,3],[0,1,3],[0,1,2]]
		// Game1.walkables = [0]
		//
		// //these are the game attributes
		// Game1.map = null //Set on level.create
		// Game1.level = undefined // set on Level.create,
		// Game1.levelName = 'Test'
		// Game1.units = [[],[],[],[]] // List of all units
		// Game1.buildings = [[],[],[],[]] // List of all buildings
		// Game1.staus[knight] = GameStatus.play
		// Game1.ai = true
		// Game1.tileSize = 32
		// Game1.debug = true

		// Position.y[blueTank] = 100
		// Sprite.texture[blueTank] = Textures.TankBlue
		// Input.speed[blueTank] = 10

		// create random cpu tanks
		for (let i = 0; i < 2; ++i)
		{
			const tank = addEntity(this.world)

			addComponent(this.world, Position, tank)
			Position.x[tank] = Phaser.Math.Between(width * 0.25, width * 0.75)
			Position.y[tank] = Phaser.Math.Between(height * 0.25, height * 0.75)

			addComponent(this.world, Velocity, tank)
			addComponent(this.world, Rotation, tank)

			addComponent(this.world, Sprite, tank)
			Sprite.texture[tank] = Phaser.Math.Between(1, 2)

			addComponent(this.world, CPU, tank)
			CPU.timeBetweenActions[tank] = Phaser.Math.Between(0, 500)

			addComponent(this.world, Unit, tank)

			// addComponent(this.world, Input, tank)
			// Input.speed[tank] = 10
		}




		// create the systems
		this.levelSystem = createLevelSystem(this, this.game, this.world)
		this.playerSystem = createPlayerSystem(this.cursors)
		this.cpuSystem = createCPUSystem(this)
		this.hudSystem = createHudSystem(this.cursors, this.game, this, this.world)
		this.movementSystem = createMovementSystem()
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
}

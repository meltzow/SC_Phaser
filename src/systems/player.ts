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

export default function createPlayerSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
	const playerQuery = defineQuery([Player, Velocity, Rotation, Input])

	return defineSystem((world: IWorld) => {
		const entities = playerQuery(world)
		
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]
			if (cursors) {
			if (cursors.left.isDown)
			{
				//TODO: hier muss die HUD verschoben werden.
				Input.direction[id] = Direction.Left
			}
			else if (cursors.right.isDown)
			{
				Input.direction[id] = Direction.Right
			}
			else if (cursors.up.isDown)
			{
				Input.direction[id] = Direction.Up
			}
			else if (cursors.down.isDown)
			{
				Input.direction[id] = Direction.Down
			}
			else
			{
				Input.direction[id] = Direction.None
			}
		}
		}
	
		return world
	})
}

import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
	IWorld
} from 'bitecs'

import Player from '../components/Player'
import Rotation, {Direction} from "../components/Rotation";

export default function createInputSystem(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
	const playerQuery = defineQuery([Player, Rotation])

	return defineSystem((world: IWorld) => {
		const entities = playerQuery(world)

		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]
			if (cursors) {
			if (cursors.left.isDown)
			{
				Rotation.direction[id] = Direction.Left
			}
			else if (cursors.right.isDown)
			{
				Rotation.direction[id] = Direction.Right
			}
			else if (cursors.up.isDown)
			{
				Rotation.direction[id] = Direction.Up
			}
			else if (cursors.down.isDown)
			{
				Rotation.direction[id] = Direction.Down
			}
			else
			{
				Rotation.direction[id] = Direction.None
				// Input.speed[id] = 0
			}
		}
		}

		return world
	})
}

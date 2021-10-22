import Phaser from 'phaser'


// export default function createCPUSystem(scene: Phaser.Scene) {
// 	const cpuQuery = defineQuery([CPU, Velocity, Rotation, Position])
//
// 	return defineSystem((world) => {
// 		const entities = cpuQuery(world)
//
// 		const dt = scene.game.loop.delta
// 		for (let i = 0; i < entities.length; ++i)
// 		{
// 			const id = entities[i]
//
// 			CPU.accumulatedTime[id] += dt
//
// 			if (CPU.accumulatedTime[id] < CPU.timeBetweenActions[id])
// 			{
// 				continue
// 			}
//
// 			CPU.accumulatedTime[id] = 0
//
// 			switch (Phaser.Math.Between(0, 20))
// 			{
// 				// left
// 				case 0:
// 				{
// 					Rotation.direction[id] = Direction.Left
// 					break
// 				}
//
// 				// right
// 				case 1:
// 				{
// 					Rotation.direction[id] = Direction.Right
// 					break
// 				}
//
// 				// up
// 				case 2:
// 				{
// 					Rotation.direction[id] = Direction.Up
// 					break
// 				}
//
// 				// down
// 				case 3:
// 				{
// 					Rotation.direction[id] = Direction.Down
// 					break
// 				}
//
// 				default:
// 				{
// 					Rotation.direction[id] = Direction.None
// 					break
// 				}
// 			}
// 		}
//
// 		return world
// 	})
// }

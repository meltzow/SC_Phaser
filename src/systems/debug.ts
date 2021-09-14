import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
} from 'bitecs'

import CPU from '../components/CPU'
import Velocity from '../components/Velocity'
import Rotation from '../components/Rotation'
import Input, { Direction} from '../components/Input'
import Game from "../components/Game";
import {EventDispatcher} from "../events/EventDispatcher";
import UnitsSelected from "../events/UnitsSelected";

export default function createDebugSystem(scene: Phaser.Scene) {

	function log(msg: string) {
		console.log(msg )
	}

	const debugQuery = defineQuery([Game])

	//this.emitter = EventDispatcher.getInstance();
	// this.emitter.on('ATTACK',this.doAttack.bind(this));
	// @ts-ignore
	EventDispatcher.getInstance().on(UnitsSelected.toEventName(), (ctx: object) => {
		log("Event ["+UnitsSelected.toEventName()+"]: " + ctx)
	})


	return defineSystem((world) => {
		const entities = debugQuery(world)

		const dt = scene.game.loop.delta
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]

			// Game.debug[id]

		}

		return world
	})
}

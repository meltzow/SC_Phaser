import Phaser from 'phaser'
import {
	defineSystem,
	defineQuery,
} from 'bitecs'

import Game from "../components/Game";
import {EventDispatcher} from "../events/EventDispatcher";
import UnitsSelected from "../events/UnitsSelected";
import MouseClickedEvent from "../events/MouseClickedEvent";

export default function createDebugSystem(scene: Phaser.Scene) {

	function log(msg: string) {
		console.log(msg )
	}

	const debugQuery = defineQuery([Game])

	//this.emitter = EventDispatcher.getInstance();
	// this.emitter.on('ATTACK',this.doAttack.bind(this))
	EventDispatcher.getInstance().on(UnitsSelected.name, (ctx: UnitsSelected) => {
		log("Event ["+UnitsSelected.name+"]: " + ctx)
	})

	EventDispatcher.getInstance().on(MouseClickedEvent.name, (ctx: MouseClickedEvent) => {
		log("Event ["+MouseClickedEvent.name+"]: " + ctx)
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

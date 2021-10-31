import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Unit extends Component{
	// @type("string") ID: string | undefined
	//see #UnitTypes
	@type("number")type: number | undefined
	@type("number")playerId: number | undefined
	@type("number")maxLife: number | undefined
	@type("number") life: number | undefined

	getName(): string {
		return Unit.name;
	}
}

export enum UnitTypes
{
	player,
	enemies,
	resources,
	allies,
	buildings

}

export enum UnitStatus
{
	walking,
	idle

}

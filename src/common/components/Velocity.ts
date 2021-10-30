import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Velocity extends Component{
	@type("float32")x: number |undefined
	@type("float32") y: number | undefined

	getName(): string {
		return Velocity.name;
	}
}
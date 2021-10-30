import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Velocity extends Component{
	@type("float32")x: number = 0
	@type("float32") y: number = 0

	getName(): string {
		return Velocity.name;
	}
}
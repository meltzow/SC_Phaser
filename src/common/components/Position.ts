import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Position extends Component {
	@type("number") x: number = 0
	@type("number") y: number = 0

	getName(): string {
		return Position.name;
	}
}

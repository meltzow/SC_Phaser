import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class CPU extends Component {
	// @ts-ignore
	@type("number") timeBetweenActions: number;
	// @ts-ignore
	@type("number") accumulatedTime: number;
	getName(): string {
		return CPU.name;
	}
}


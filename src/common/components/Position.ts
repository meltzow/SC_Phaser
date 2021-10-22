import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Position extends Component {
	@type("float64") x: number | undefined
	@type("float64") y: number | undefined
}

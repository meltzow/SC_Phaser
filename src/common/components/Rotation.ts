import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Rotation extends Component {
	@type("float64" )angle: number | undefined
	@type("number" )direction: number | undefined
}

export enum Direction
{
	None,
	Left,
	Right,
	Up,
	Down
}

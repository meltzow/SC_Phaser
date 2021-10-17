import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Level extends Component {
	@type("number") LAYER_ANIMATION: number = 500;
	@type("number") tileheight: number = 0;
	@type("number") tilewidth: number = 0;
	@type("number") height: number = 0;
	@type("number") width: number = 0;
}

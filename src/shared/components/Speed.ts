import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Speed extends Component{
	@type("number") value: number | undefined
}
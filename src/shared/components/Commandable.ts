import {Component} from "@colyseus/ecs";
import {ArraySchema, type} from "@colyseus/schema";
import {Command} from "./commands/Command";

export class Commandable extends Component {
	@type([Command]) commands:ArraySchema<Command> = new ArraySchema<Command>();
}

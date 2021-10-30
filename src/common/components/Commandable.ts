import {Component} from "@colyseus/ecs";
import {ArraySchema, type} from "@colyseus/schema";
import {Command} from "./commands/Command";
import * as FOO from "./components"

export class Commandable extends Component implements FOO.Component {
	@type([Command]) commands:ArraySchema<Command> = new ArraySchema<Command>();

	getName(): string {
		return Commandable.name;
	}
}

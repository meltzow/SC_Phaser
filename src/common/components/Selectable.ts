import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Selectable extends Component {
	@type("boolean") isSelected: boolean | undefined

	getName(): string {
		return Selectable.name;
	}
}
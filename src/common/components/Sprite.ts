import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Sprite extends Component{
	@type("number") texture: number | undefined

	getName(): string {
		return Sprite.name;
	}
}

export enum SpriteTextures
{
	TankBlue,
	TankGreen,
	TankRed,
	Link
}

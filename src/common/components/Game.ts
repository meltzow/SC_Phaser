import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export enum GameStatus
{
	debug,
	play,
	paused,
	gameOver,
	won

}
export class Game extends Component {
	@type("string") status: string = GameStatus.gameOver.toString();
	@type("string") levelName: string = "";
	@type("boolean") debug: boolean = false;
	@type("string") UNIT_TYPES: string = ROCK.toString();
	@type("string")map: string = "";

}

//Globally accessible variables (static)
export const UNIT_TYPES = 3;
export const ROCK = 0;
export const PAPER = 1;
export const SCISSOR = 2;

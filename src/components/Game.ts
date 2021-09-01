import { defineComponent, Types } from 'bitecs'

export const Game = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32,
	staus: Types.ui8,
	resources: Types.ui8,
	levelName: Types.ui8,
	debug: Types.ui8,
	UNIT_TYPES: Types.ui8,
	map: Types.ui8,
})

export default Game

export enum GameStatus
{
	"play"
}

//Globally accessible variables (static)
export const UNIT_TYPES: number = 3;
export const ROCK = 0;
export const PAPER = 1;
export const SCISSOR = 2;

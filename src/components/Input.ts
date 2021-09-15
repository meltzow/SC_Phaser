import { defineComponent, Types } from 'bitecs'

export enum Click
{
	singleClick,
	doubleClick,

}

export const Input = defineComponent({
	direction: Types.ui8,
	mouseX: Types.ui8,
	mouseY: Types.ui8,

	CAMERA_SPEED: Types.ui8,
	DOUBLE_CLICK_TIME: Types.ui8,

	// SINGLE_CLICK: Types.uid8 = "single_click",
	// DOUBLE_CLICK: Types.uid8 = "double_click",
	click: Types.ui8

	// DRAG: Types.uid8 = "drag",
	// NONE: Types.uid8 = "none",

	// CLICK_BUILDING: Types.uid8 = "click_building",
	// PLACE_BUILDING: Types.uid8 = "place_building",

	// mouseStatus = NONE,
	// clickStart ,
	// clickTime ,

	// dragRect,
	// overrideMove: Types.uid8 = false,
})

export enum Direction
{
	None,
	Left,
	Right,
	Up,
	Down
}

export default Input

import { defineComponent, Types } from 'bitecs'

export enum mouseStatus {
	NONE,
	DRAG,
	SINGLE_CLICK,
	DOUBLE_CLICK,
	CLICK_BUILDING,
	PLACE_BUILDING
}

export enum Click
{
	singleClick,
	doubleClick,

}

export const Input = defineComponent({
	mouseX: Types.ui8,
	mouseY: Types.ui8,
	mouseStatus: Types.ui8,

	CAMERA_SPEED: Types.ui8,
	DOUBLE_CLICK_TIME: Types.ui8,

	click: Types.ui8
	// clickStart ,
	// clickTime ,

	// dragRect,
	// overrideMove: Types.uid8 = false,
})



export default Input

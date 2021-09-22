import { defineComponent, Types } from 'bitecs'

let LAYER_ANIMATION = 500
export const Level = defineComponent({
	LAYER_ANIMATION: Types.ui32,
	tileheight: Types.ui8,
	tilewidth: Types.ui8,
	height: Types.ui8,
	width: Types.ui8,
	// data: [Types.ui8, 2500]
})

export default Level

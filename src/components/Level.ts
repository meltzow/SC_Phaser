import { defineComponent, Types } from 'bitecs'

let LAYER_ANIMATION = 500
export const Level = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32,
	LAYER_ANIMATION: Types.ui32
})

export default Level

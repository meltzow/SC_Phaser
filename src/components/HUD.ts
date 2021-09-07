import { defineComponent, Types } from 'bitecs'

export const HUD = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32
})

export default HUD

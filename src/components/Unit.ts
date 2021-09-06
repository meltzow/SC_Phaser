import { defineComponent, Types } from 'bitecs'

export const Unit = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32
})

export default Unit

import { defineComponent, Types } from 'bitecs'

export const Commandable = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32
})

export default Commandable

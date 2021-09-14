import { defineComponent, Types } from 'bitecs'

export const Selectable = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32
})

export default Selectable

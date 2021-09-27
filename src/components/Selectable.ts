import { defineComponent, Types } from 'bitecs'

export const Selectable = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32,
	isSelected: Types.ui8
})

export default Selectable

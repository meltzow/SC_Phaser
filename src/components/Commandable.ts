import { defineComponent, Types } from 'bitecs'

export const Commandable = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32,
	commands: [Types.ui8, 5]
})

export default Commandable

export enum Command
{
	GoTo,
	Attack
}

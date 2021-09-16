import { defineComponent, Types } from 'bitecs'

export const Unit = defineComponent({
	timeBetweenActions: Types.ui32,
	accumulatedTime: Types.ui32,
	//see #UnitTypes
	type: Types.ui8,
	playerId: Types.ui16,
	maxLife: Types.ui16
})

export default Unit

export enum UnitTypes
{
	player,
	enemies,
	resources,
	allies,
	buildings

}

export enum UnitStatus
{
	walking,
	idle

}

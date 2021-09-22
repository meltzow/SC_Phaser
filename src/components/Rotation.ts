import { defineComponent, Types } from 'bitecs'

export const Rotation = defineComponent({
	angle: Types.f32,
	direction: Types.ui8
})

export default Rotation

export enum Direction
{
	None,
	Left,
	Right,
	Up,
	Down
}

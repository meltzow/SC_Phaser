import {defineComponent, Types} from "bitecs";

export const Command = defineComponent({
    type: Types.ui8,
    targetX: Types.f32,
    targetY: Types.f32
})

export enum CommandType {
    NONE,
    GOTO,
    ATTACK
}

import {defineComponent, ListType, TypedArray, Types} from 'bitecs'

// const List = defineComponent({ values: [Types.f32, 3] }) // [type, length]

export const Player = defineComponent({


    //TODO these attributes are PLAYER attributes, not for a unique game entity
    resources: [Types.ui8, 3],
    ID: Types.ui8,
    // levelResources = [[],[],[]]
    // visibleMap = false
    selectedUnits: [Types.ui8, 50] ,
    enemyPlayerIds: [Types.ui8, 50]
    // walkables = [0]
    //


})

export default Player

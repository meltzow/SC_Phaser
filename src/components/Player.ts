import {defineComponent, ListType, TypedArray, Types} from 'bitecs'

const List = defineComponent({ values: [Types.f32, 3] }) // [type, length]

export const Player = defineComponent({


    //TODO these attributes are PLAYER attributes, not for a unique game entity
    resources: [Types.ui8, 1],
    // levelResources = [[],[],[]]
    // visibleMap = false
    // selectedUnits = [[],[],[],[]] //List of all selected units
    // enemyPlayerIds = [[1,2,3],[0,2,3],[0,1,3],[0,1,2]]
    // walkables = [0]
    //


})

export default Player

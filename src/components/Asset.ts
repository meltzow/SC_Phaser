import {Component} from "./Component";

export class Asset extends Component {
    animations: Animation
}

export class Animation extends Component {
    //'southeast', [64, 65, 66, 67], 6, true)
    key: string
    frames: string[]
    frameRate: number
    loop: boolean
}
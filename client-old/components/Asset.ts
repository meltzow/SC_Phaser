import {Component} from "./Component";

export class Asset extends Component {
    animations: Animation

    static key(): string {
        return "Asset"
    }

    key():string {
        return Asset.key();
    }
}

export class Animation extends Component {
    //'southeast', [64, 65, 66, 67], 6, true)
    name: string
    frames: string[]
    frameRate: number
    loop: boolean

    static key(): string {
        return "Animation"
    }

    key():string {
        return Animation.key();
    }
}
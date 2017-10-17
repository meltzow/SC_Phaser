import {Component} from "./Component";

export class Position extends Component {
    x: number
    y: number
    z: number

    constructor(opt?) {
        super()
        this.x = opt.x
        this.y = opt.y
        this.z = opt.z
    }

    static key(): string {
        return "Position"
    }

    key():string {
        return Position.key();
    }
}
import {Component} from "./Component";

export class Moveable extends Component {
    x: number;
    y: number;
    z: number;

    constructor(opt?) {
        super()
        if (!opt || !opt.target) {
            return;
        }
        this.x = opt.target.x
        this.y = opt.target.y
        this.z = opt.target.z
    }

    static key(): string {
        return "Moveable"
    }

    key(): string {
        return Moveable.key();
    }
}
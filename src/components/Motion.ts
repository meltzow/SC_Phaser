import {Component, ComponentClass} from "./Component";

export class Motion extends Component {
    speed: number;
    acceleration: number;
    facing: FACING;

    constructor(opt?) {
        super()
        if (!opt) return
        this.speed = opt.speed
        this.acceleration = opt.acceleration
        this.facing = opt.facing
    }

    static key(): string {
        return "Motion"
    }

    key():string {
        return Motion.key();
    }
}

enum FACING {
    NORTH, SOUTH
}
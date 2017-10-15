import {Component, ComponentClass} from "./Component";

export class Motion extends Component {
    speed: number;
    acceleration: number;
    facing: string;

    constructor(opt?:Motion) {
        super()
        this.speed = opt.speed
        this.acceleration = opt.acceleration
        this.facing = opt.facing
    }
}
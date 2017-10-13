import {Component, ComponentClass} from "./Component";

export class Motion implements Component {
    speed: number;
    acceleration: number;
    facing: string;

    constructor(opt:Motion) {
        this.speed = opt.speed
        this.acceleration = opt.acceleration
        this.facing = opt.facing
    }
}
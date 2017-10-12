import {Component, ComponentClass} from "./Component";

export class Motion implements Component {
    speed: number;
    acceleration: number;

    constructor(opt:Motion) {
        this.speed = opt.speed
        this.acceleration = opt.acceleration
    }
}
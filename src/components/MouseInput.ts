import {Component} from "./Component";
import Point3 = Phaser.Plugin.Isometric.Point3;

export class MouseInput extends Component {

    button: BUTTON;
    x: number
    y: number

    constructor(opt?) {
        super()
        this.button = opt.button
        this.x = opt.x
        this.y = opt.y
    }

    static key(): string {
        return "MouseInput"
    }

    key(): string {
        return MouseInput.key();
    }
}

export enum BUTTON {
    LEFT, RIGHT
}
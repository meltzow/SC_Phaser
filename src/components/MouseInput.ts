import {Component} from "./Component";
import Point3 = Phaser.Plugin.Isometric.Point3;

export class MouseInput extends Component {

    button: BUTTON;
    isoPoint: Point3

    constructor(opt?) {
        super()
        this.button = opt.button
        this.isoPoint = opt.isoPoint
    }

    static key(): string {
        return "KeyboardInput"
    }

    key(): string {
        return MouseInput.key();
    }
}

export enum BUTTON {
    LEFT, RIGHT
}
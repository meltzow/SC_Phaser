import {KeyboardInput} from "../components/KeyboardInput";
import {Event} from './Event'
import Point3 = Phaser.Plugin.Isometric.Point3;

export class MouseInputEvent extends Event {
    button: BUTTON;
    isoPoint: Point3

    constructor(opt?) {
        super();
        if (!opt) {
            return
        }
        this.button = opt.button
        this.isoPoint = opt.Point3
    }

    static key(): string {
        return "MouseInputEvent"
    }

    key(): string {
        return MouseInputEvent.key();
    }

}

export enum BUTTON {
    LEFT, RIGHT
}
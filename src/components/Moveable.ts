import {Component} from "./Component";
import Point3 = Phaser.Plugin.Isometric.Point3;

export class Moveable extends Component {
    target: Point3;

    constructor(opt?) {
        super()
        this.target = opt.target
    }

    static key(): string {
        return "Moveable"
    }

    key(): string {
        return Moveable.key();
    }
}
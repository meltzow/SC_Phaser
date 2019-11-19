import {Event} from "./Event";
import Point3 = Phaser.Plugin.Isometric.Point3;

export class MovePlayerEvent extends  Event {
    player:number;
    target: Point3

    constructor(opt?) {
        super();
        this.player = opt.player;
        this.target = opt.target;
    }


    static key(): string {
        return "MovePlayerEvent"
    }

    key():string {
        return MovePlayerEvent.key();
    }
}
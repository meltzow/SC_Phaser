import {Event} from "./Event";

export class MovePlayerEvent extends  Event {
    player:number;
    keyCode: number;

    constructor(opt?) {
        super();
        this.player = opt.player;
        this.keyCode = opt.keyCode;
    }

    static key(): string {
        return "MovePlayerEvent"
    }

    key():string {
        return MovePlayerEvent.key();
    }
}
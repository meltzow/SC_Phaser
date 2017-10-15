import {Event} from "./Event";

export class MovePlayerEvent extends  Event {
    player:number;
    keyCode: number;

    constructor(opt:MovePlayerEvent) {
        super();
        this.player = opt.player;
        this.keyCode = opt.keyCode;
    }
}
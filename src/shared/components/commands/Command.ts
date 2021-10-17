import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class Command extends Component{
    @type("number") type: number | undefined
    @type("float32")targetX: number | undefined
    @type("float32") targetY: number | undefined
}

export enum CommandType {
    NONE,
    GOTO,
    ATTACK
}

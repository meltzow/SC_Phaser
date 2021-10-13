import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class InputComponent extends Component {
    // @ts-ignore
    @type("number") mouseX: number;
    // @ts-ignore
    @type("number") mouseY: number;
    // @ts-ignore
    @type("number") mouseStatus: string;
}
import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

export class InputComponent extends Component {
    // @ts-ignore
    @type("float64") mouseX: number;
    // @ts-ignore
    @type("float64") mouseY: number;
// @ts-ignore
    @type("string") mouseStatus: string;
    // @ts-ignore
    @type("number") CAMERA_SPEED: number;
    // @ts-ignore
    @type("number") DOUBLE_CLICK_TIME: number;

    @type("string") click: string = ""
    getName(): string {
        return InputComponent.name;
    }
}

export enum mouseStatus {
    NONE,
    DRAG,
    SINGLE_CLICK,
    DOUBLE_CLICK,
    CLICK_BUILDING,
    PLACE_BUILDING
}

export enum Click
{
    singleClick,
    doubleClick,

}
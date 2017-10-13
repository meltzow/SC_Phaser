import {Component} from "./Component";

export class KeyboardInput implements Component {

    keyCode:number;

    constructor(opt:KeyboardInput) {
        this.keyCode = opt.keyCode
    }
}
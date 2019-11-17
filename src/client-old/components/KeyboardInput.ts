import {Component} from "./Component";

export class KeyboardInput extends Component {

    keyCode:number;

    constructor(opt?:KeyboardInput) {
        super()
        this.keyCode = opt.keyCode
    }

    static key(): string {
        return "KeyboardInput"
    }

    key():string {
        return KeyboardInput.key();
    }
}
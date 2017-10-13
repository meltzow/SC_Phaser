import {KeyboardInput} from "../components/KeyboardInput";
import {Event} from './Event'

export class KeyInputEvent extends  Event {
    keyCode:number;

    constructor(opt:KeyboardInput) {
        super();
        this.keyCode = opt.keyCode
    }
}
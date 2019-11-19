import {KeyboardInput} from "../components/KeyboardInput";
import {Event} from './Event'

export class KeyInputEvent extends Event {
    keyCode: number;

    constructor(opt?) {
        super();
        if (!opt) {
            return
        }
        this.keyCode = opt.keyCode
    }

    static key(): string {
        return "KeyInputEvent"
    }

    key(): string {
        return KeyInputEvent.key();
    }

}
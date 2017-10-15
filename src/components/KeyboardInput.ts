import {Component} from "./Component";

export class KeyboardInput extends Component {

    keyCode:number;

    constructor(opt?:KeyboardInput) {
        super()
        this.keyCode = opt.keyCode
    }
}
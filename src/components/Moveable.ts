import {Component} from "./Component";

export class Moveable extends Component {
    
    constructor(opt?) {
        super()
    }

    static key(): string {
        return "Moveable"
    }

    key(): string {
        return Moveable.key();
    }
}
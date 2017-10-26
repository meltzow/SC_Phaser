import {Component} from "../Component";

export class GoToCommand extends Component {
    x: number
    y: number

    constructor(opt?) {
        super();
        if (opt) {
            this.x = opt.x;
            this.y = opt.y;
        }
    }

    static key(): string {
        return "GoToCommand"
    }

    key(): string {
        return GoToCommand.key();
    }

}
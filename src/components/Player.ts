import {Component} from "typed-ecstasy"

export class Player extends Component {
    color: string
    name: string

    static key(): string {
        return "Player"
    }

    key():string {
        return Player.key();
    }
}
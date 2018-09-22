import {Entity} from "../entities/Entity";
import {Component} from "typed-ecstasy"

class Game extends Component {
    entities: Entity[]

    static key(): string {
        return "Game"
    }

    key():string {
        return Game.key();
    }
}
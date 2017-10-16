import {Entity} from "../entities/Entity";
import {Component} from "./Component";

class Game extends Component {
    entities: Entity[]

    static key(): string {
        return "Game"
    }

    key():string {
        return Game.key();
    }
}
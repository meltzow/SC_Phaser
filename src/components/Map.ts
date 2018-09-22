import {Entity} from "../entities/Entity";
import {Component} from "typed-ecstasy"

export class Map extends Component {
    data: number[][]

    static key(): string {
        return "Map"
    }

    key():string {
        return Map.key();
    }
}
import {Entity} from "../entities/Entity";
import {Component} from "./Component";

export class Map extends Component {
    data: number[][]

    static key(): string {
        return "Map"
    }

    key():string {
        return Map.key();
    }
}
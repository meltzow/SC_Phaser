import {Component} from "./Component";
import {Entity} from "../entities/Entity";
import {Player} from "./Player";

class Faction extends Component {
    name: string
    entities: Entity[]
    players: Player[]
}
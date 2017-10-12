import {Component} from "./Component";
import {Entity} from "../entities/Entity";

class Faction implements Component {
    name: string
    entities: Entity[]
    players: Player[]
}
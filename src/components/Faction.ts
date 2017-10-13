import {Component} from "./Component";
import {Entity} from "../entities/Entity";
import {Player} from "./Player";

class Faction implements Component {
    name: string
    entities: Entity[]
    players: Player[]
}
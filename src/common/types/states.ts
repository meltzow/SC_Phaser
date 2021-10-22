import {type, Schema, ArraySchema} from "@colyseus/schema";
import {Entity} from "@colyseus/ecs";

export interface PlayerState {
  id: string;
}

export interface HeroesState {
  players: PlayerState[];
}

export class State extends Schema {
  @type([Entity]) public entities = new ArraySchema<Entity>();
  // @type({ map: Player })
  // players = new MapSchema<Player>();

  // public toConsole(): string {
  //     return "entity count: " + this.entities.toArray().length
  // }
}
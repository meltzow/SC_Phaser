import * as ECS from "@colyseus/ecs";
import {type, Schema, ArraySchema, MapSchema} from "@colyseus/schema";

export interface Component {
    getName(): string
}

// export class Movement extends Component {
//   @type(Vector2) velocity = new Vector2();
//   @type(Vector2) acceleration = new Vector2();
// }
//
// export class Circle extends Component {
//     @type(Vector2) position = new Vector2();
//     // @ts-ignore
//     @type("number") radius: number;
//     @type(Vector2) velocity = new Vector2();
//     @type(Vector2) acceleration = new Vector2();
// }
//
// export class CanvasContext extends Component {
//     // @ts-ignore
//     @type("number") width: number;
//     // @ts-ignore
//     @type("number") height: number;
// }
//
// export class DemoSettings extends Component {
//     @type("number") speedMultiplier = 0.001;
// }
//
// export class Intersecting extends Component {
//     @type(["number"]) points: number[] = [];
// }



export class State extends Schema {
    @type([ECS.Entity]) public entities = new ArraySchema<ECS.Entity>();
    // @type({ map: Player })
    // players = new MapSchema<Player>();

    // public toConsole(): string {
    //     return "entity count: " + this.entities.toArray().length
    // }
}


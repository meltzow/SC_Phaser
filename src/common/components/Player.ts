import {Component} from "@colyseus/ecs";
import {type} from "@colyseus/schema";

// const List = defineComponent({ values: [Types.f32, 3] }) // [type, length]

export class Player extends Component {
    @type("number") ID: number | undefined

    getName(): string {
        return Player.name;
    }
}

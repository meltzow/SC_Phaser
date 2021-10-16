import { System } from "@colyseus/ecs";
import {InputComponent} from "../components/components";
import {Room} from "colyseus";


export function getServerSystem(room: Room) {

return class ServerSystem extends System {

    static queries = {
        input: { components: [InputComponent] },
    };

    execute(delta: number) {
        if (this.queries.input.changed) {
            let input = this.queries.input.changed[0].getComponent(InputComponent)
            room.broadcast("InputChanged", input )
            console.log("server says: player clicked mouse @ [" + input?.mouseX + "," + input?.mouseY + "]")
        }
    }
}
}

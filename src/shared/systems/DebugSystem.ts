import { System } from "@colyseus/ecs";
import {InputComponent} from "../components/components";

export class DebugSystem extends System {

    static queries = {
        input: { components: [InputComponent],
            listen: {
                added: false,
                removed: false,
                changed: true  // Detect that any of the components on the query (Box, Transform) has changed
            }},
    };

    execute(delta: number) {
        if (this.queries.input.changed && this.queries.input.changed.length) {
            const input = this.queries.input.changed[0]
            if (!input) return
            const x = input.getComponent(InputComponent)!.mouseX;
            const y = input.getComponent(InputComponent)!.mouseY;
            console.log("server says: player clicked mouse @ [" + x + "," + y + "]")
        }
    }
}
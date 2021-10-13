import { System } from "@colyseus/ecs";
import {InputComponent} from "../components/InputComponent";

export class DebugSystem extends System {
    static queries = {
        input: { components: [InputComponent] },
    };

    execute(delta: number) {
        if (this.queries.input.changed) {
            const input = this.queries.input.results[0]
            if (!input) return
            const x = input.getComponent(InputComponent)!.mouseX;
            const y = input.getComponent(InputComponent)!.mouseY;
            console.log("server says: play clicked mouse @ [" + x + "," + y + "]")
        }
    }
}
import { System } from "@colyseus/ecs";
import {InputComponent} from "../components/InputComponent";
import {random} from "../utils";
import {Circle} from "../components/components";

export class SimulateInputSystem extends System {
    static queries = {
        input: { components: [InputComponent] }
    };

    execute(delta: number) {
        if (this.queries.input.results.length) {
            const input = this.queries.input.results[0]
            const x = random(0, 100);
            input.getMutableComponent(InputComponent)!.mouseX = x;
            const y = random(0, 100);
            input.getMutableComponent(InputComponent)!.mouseY = y;
            console.log("simulate: mouse click @ [" + x + "," + y + "]")
        }
    }
}
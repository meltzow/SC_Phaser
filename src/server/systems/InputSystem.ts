import { System } from "@colyseus/ecs";
import {InputComponent} from "../../common/components/InputComponent";

export class InputSystem extends System {

    static input: InputComponent | null

    static queries = {
        input: { components: [InputComponent] }
    }

    public static setInput(input: InputComponent) {
        InputSystem.input = input
    }

    execute(delta: number) {
        if (InputSystem.input && this.queries.input.results.length) {
            const input = this.queries.input.results[0]
            if (!input) return
            let comp = input.getMutableComponent(InputComponent)
            if (comp) {
                comp.mouseX = InputSystem.input.mouseX
                comp.mouseY = InputSystem.input.mouseY
            }
            console.log("server says: player clicked mouse @ [" + InputSystem.input.mouseX + "," + InputSystem.input.mouseY + "]")
            InputSystem.input = null
        }
    }
}
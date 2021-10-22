import {World} from "@colyseus/ecs";
import {InputComponent} from "../components/InputComponent";

export function registerComponents(world: World) {
    world.registerComponent(InputComponent)
    //FIXME: add more components here
}


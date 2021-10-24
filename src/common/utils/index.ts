import {World} from "@colyseus/ecs";
import {InputComponent} from "../components/InputComponent";
import {Level} from "../components/Level";

export function registerComponents(world: World) {
    world
        .registerComponent(InputComponent)
        .registerComponent(Level)
    //FIXME: add more components here
}


import {World} from "@colyseus/ecs";
import {InputComponent} from "../components/InputComponent";
import {Level} from "../components/Level";
import {Position} from "../components/Position";
import {Rotation} from "../components/Rotation";
import {Sprite} from "../components/Sprite";
import {Commandable} from "../components/Commandable";
import {Selectable} from "../components/Selectable";
import {Unit} from "../components/Unit";
import {Speed} from "../components/Speed";
import {Velocity} from "../components/Velocity";

export function registerComponents(world: World) {
    world
        .registerComponent(Commandable)
        .registerComponent(InputComponent)
        .registerComponent(Level)
        .registerComponent(Position)
        .registerComponent(Rotation)
        .registerComponent(Selectable)
        .registerComponent(Speed)
        .registerComponent(Sprite)
        .registerComponent(Unit)
        .registerComponent(Velocity)
    //FIXME: add more components here
}


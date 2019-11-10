import {BaseSystem} from "./BaseSystem";
import {EntityUtils} from "../entities/EntityUtils";
import {EventBus} from "../events/EventBus";
import {Entity} from "../entities/Entity";
import {MouseInput} from "../components/MouseInput";
import {Player} from "../components/Player";
import {BUTTON, MouseInputEvent} from "../events/MouseInputEvent";
import {MovePlayerEvent} from "../events/MovePlayerEvent"
import {Moveable} from "../components/Moveable";
import {GoToCommand} from "../components/commands/GoToCommand";

export class MouseInputSystem extends BaseSystem {

    constructor() {
        super([MouseInput, Player]);
    }


    onEntityAdded(game: Phaser.Game, entity: Entity): void {
        super.onEntityAdded(game, entity)
        if (!entity ) {
            return
        }
        var mouseInput = entity.get(MouseInput);
        if (!mouseInput) {
            return
        }
        switch (mouseInput.button) {
            case BUTTON.LEFT:
                var cursorPos = game.iso.unproject(
                    new Phaser.Point(
                        (game.input.activePointer.position.x + game.camera.x) / game.camera.scale.x,
                        (game.input.activePointer.position.y + game.camera.y) / game.camera.scale.y
                    )
                );
                // FIXME: find selected entities
                var movableEntities = EntityUtils.findEntities(Moveable)
                console.log("button clicked on",cursorPos);
                // FIXME: the tile size(38) is hardcoded currently
                movableEntities.forEach((ent) => {
                    ent.addComponent(new GoToCommand({x: Math.floor(cursorPos.x / 38), y: Math.floor(cursorPos.y / 38)}))
                })
            default:
                break;
        }


    }

}
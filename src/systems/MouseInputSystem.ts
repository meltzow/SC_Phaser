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
  /*      EventBus.subscribe(MouseInputEvent, (event: MouseInputEvent) => {
             this.handleMouseInputEvent(event);
         },)*/
    }
/*
    handleMouseInputEvent(event: MouseInputEvent) {
        var entities = EntityUtils.findEntities(Player);
        if (!entities) {
            return;
        }

        entities.forEach((e) => {
            switch (event.button) {
                case BUTTON.LEFT:
                    //FIXME get mouseposition translated to isometric
                    EventBus.post(new MovePlayerEvent({
                        player: 0,
                        target: new Phaser.Plugin.Isometric.Point3(0, 0, 0)
                    }));
                    break;
                case BUTTON.RIGHT:
                    EventBus.post(new MovePlayerEvent({
                        player: 0,
                        target: new Phaser.Plugin.Isometric.Point3(10, 10, 0)
                    }));
                    break;
                default:
                    break;
            }
//            EntityUtils.updateComponent(e, camera);
            EntityUtils.removeComponent(e, MovePlayerEvent);
        })
    }*/

    onEntityAdded(game: Phaser.Game, entity: Entity): void {
        var mouseInput = entity.get(MouseInput);
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
                // FIXME: the tile size(38) is hardcoded currently
                movableEntities.forEach((ent) => {
                    ent.addComponent(new GoToCommand({x: Math.round(cursorPos.x / 38), y: Math.round(cursorPos.y / 38)}))
                })
            default:
                break;
        }


    }

}
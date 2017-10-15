import {BaseSystem} from "./BaseSystem";
import {Camera, MOVE} from "../components/Camera";
import {EntityUtils} from "../entities/EntityUtils";
import {KeyInputEvent} from "../events/KeyInputEvent";
import {EventBus} from "../events/EventBus";
import {Player} from "../components/Player";
import {Entity} from "../entities/Entity";

export class CameraSystem extends BaseSystem {

    constructor() {
        super([Camera, Player]);
        EventBus.subscribe(KeyInputEvent, (event: KeyInputEvent) => {
            this.handleKeyInputEvent(event);
        },)
    }

    handleKeyInputEvent(event: KeyInputEvent) {
        if (event.keyCode) {
            var entities = EntityUtils.findEntities(Camera);
            entities.forEach((entity: Entity) => {
               entity.get(Camera).nextMove = event.keyCode
            });
        }
    }

    update(game: Phaser.Game) {
        var entitties = EntityUtils.findEntities(Camera);
        entitties.forEach((entity) => {
            var cam: Camera = entity.get(Camera)
            if (cam.nextMove == MOVE.STRAFE_NORTH) {
                game.camera.y = cam.y - cam.maxSpeed;
            }
            else if (cam.nextMove == MOVE.STRAFE_SOUTH) {
                game.camera.y = cam.y + cam.maxSpeed;
            }

            if (cam.nextMove == MOVE.STRAFE_WEST) {
                game.camera.x = cam.x - cam.maxSpeed;
            }
            else if (cam.nextMove == MOVE.STRAFE_EAST) {
                game.camera.x = cam.x + cam.maxSpeed;
            }
        })
    }

    render(game: Phaser.Game) {
        game.debug.cameraInfo(game.camera, 32, 32);
    }
}
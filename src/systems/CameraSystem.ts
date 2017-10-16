import {BaseSystem} from "./BaseSystem";
import {Camera, MOVE} from "../components/Camera";
import {Player} from "../components/Player";
import {Entity} from "../entities/Entity";
import {EntityUtils} from "../entities/EntityUtils";

export class CameraSystem extends BaseSystem {

    constructor() {
        super([Camera, Player]);
    }

    update(game: Phaser.Game, entity: Entity) {
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
        cam.nextMove == MOVE.STOP;
    }

    render(game: Phaser.Game) {
        game.debug.cameraInfo(game.camera, 32, 32);
    }
}
import {BaseSystem} from "./BaseSystem";
import {Camera, MOVE} from "../components/Camera";
import {Player} from "../components/Player";
import {Entity} from "../entities/Entity";
import {EntityUtils} from "../entities/EntityUtils";

export class CameraSystem extends BaseSystem {

    constructor() {
        super([Camera, Player]);
    }

    onEntityUpdated(game: Phaser.Game, entity: Entity) {
        var cam: Camera = entity.get(Camera)

        switch (cam.nextMove) {
            case MOVE.STRAFE_NORTH:
                game.camera.y -= 2
                cam.nextMove = MOVE.STOP;
                EntityUtils.updateComponent(entity, cam)
                break;
            case MOVE.STRAFE_SOUTH:
                game.camera.y += 2
                cam.nextMove = MOVE.STOP;
                EntityUtils.updateComponent(entity, cam)
                break
            case MOVE.STRAFE_WEST:
                game.camera.x -= 2;
                cam.nextMove = MOVE.STOP;
                EntityUtils.updateComponent(entity, cam)
                break;
            case MOVE.STRAFE_EAST:
                game.camera.x += 2;
                cam.nextMove = MOVE.STOP;
                EntityUtils.updateComponent(entity, cam)
                break;
            case MOVE.STOP:
                EntityUtils.removeComponent(entity, cam)
        }
    }

    render(game: Phaser.Game) {
        game.debug.cameraInfo(game.camera, 32, 32);
    }
}
import {IteratingSystem, Family} from 'typed-ecstasy'
import {Camera, MOVE} from "../components/Camera";
import {Player} from "../components/Player";
import {Entity} from "../entities/Entity";
import {EntityUtils} from "../entities/EntityUtils";

export class CameraSystem extends IteratingSystem {

    constructor() {
        super([Camera, Player]);
    }

    onEntityUpdated(game: Phaser.Game, entity: Entity) {
        var cam: Camera = entity.get(Camera)

        switch (cam.nextMove) {
            case MOVE.STRAFE_NORTH:
                game.camera.y -= 2
                cam.nextMove = MOVE.STOP;
                entity.addOrUpdateComponent(cam)
                break;
            case MOVE.STRAFE_SOUTH:
                game.camera.y += 2
                cam.nextMove = MOVE.STOP;
                entity.addOrUpdateComponent(cam)
                break
            case MOVE.STRAFE_WEST:
                game.camera.x -= 2;
                cam.nextMove = MOVE.STOP;
                entity.addOrUpdateComponent(cam)
                break;
            case MOVE.STRAFE_EAST:
                game.camera.x += 2;
                cam.nextMove = MOVE.STOP;
                entity.addOrUpdateComponent(cam)
                break;
            case MOVE.STOP:
                entity.addOrUpdateComponent(cam)
        }
    }

    render(game: Phaser.Game) {
        game.debug.cameraInfo(game.camera, 32, 32);
    }

    toString(): String {
        return "CameraSystem"
    }
}
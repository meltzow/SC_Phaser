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
        if (cam.nextMove == MOVE.STRAFE_NORTH) {
            game.camera.y -= 2
            //game.camera.y = cam.y - cam.maxSpeed;
        }
        else if (cam.nextMove == MOVE.STRAFE_SOUTH) {
            //game.camera.y = cam.y + cam.maxSpeed;
            game.camera.y += 2
        }

        if (cam.nextMove == MOVE.STRAFE_WEST) {
            //game.camera.x = cam.x - cam.maxSpeed;
            game.camera.x -= 2;
        }
        else if (cam.nextMove == MOVE.STRAFE_EAST) {
            //game.camera.x = cam.x + cam.maxSpeed;
            game.camera.x += 2 ;
        }
        console.log("setting camera to: " + game.camera.x + "/" + game.camera.y )
        cam.nextMove == MOVE.STOP;
    }

    render(game: Phaser.Game) {
        game.debug.cameraInfo(game.camera, 32, 32);
    }
}
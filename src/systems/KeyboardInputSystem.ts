import {BaseSystem} from "./BaseSystem";
import {KeyboardInput} from "../components/KeyboardInput";
import * as Camera from '../components/Camera'
import {EntityUtils} from "../entities/EntityUtils";

export class KeyboardInputSystem extends BaseSystem {

    constructor() {
        super([]);
    }

    protected void

    update(game: Phaser.Game) {

        var entities = EntityUtils.findEntities(Camera.Camera, KeyboardInput);

        entities.forEach((e) => {
            var camera: Camera.Camera = e.get(Camera.Camera);
            var keyInput: KeyboardInput = e.get(KeyboardInput);


            var keyCode: number = keyInput.keyCode;

            switch (keyCode) {
                case Phaser.Keyboard.DOWN:
                    //game.camera.y += 4;
                    camera.nextMove = Camera.MOVE.STRAFE_SOUTH;
                    break;
                case Phaser.Keyboard.UP:
                    camera.nextMove = Camera.MOVE.STRAFE_NORTH;
                    break;
                case Phaser.Keyboard.LEFT:
                    camera.nextMove = Camera.MOVE.STRAFE_WEST;
                    break;
                case Phaser.Keyboard.RIGHT:
                    camera.nextMove = Camera.MOVE.STRAFE_EAST;
                    break;
                default:
                    break;
            }

            EntityUtils.setComponent(e, camera);
            EntityUtils.removeComponent(e, KeyboardInput);
        })
    }

}
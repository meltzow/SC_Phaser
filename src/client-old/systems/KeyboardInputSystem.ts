import {BaseSystem} from "./BaseSystem";
import {KeyboardInput} from "../components/KeyboardInput";
import * as Camera from '../components/Camera'
import {EntityUtils} from "../entities/EntityUtils";
import {EventBus} from "../events/EventBus";
import {KeyInputEvent} from "../events/KeyInputEvent";
import {Entity} from "../entities/Entity";

export class KeyboardInputSystem extends BaseSystem {

    constructor() {
        super([KeyInputEvent]);
        EventBus.subscribe(KeyInputEvent, (event: KeyInputEvent) => {
            this.handleKeyInputEvent(event);
        },)
    }

    handleKeyInputEvent(event: KeyInputEvent) {
        if (!event.keyCode) {
            return
        }

        var entities = EntityUtils.findEntities(Camera.Camera);
        if (!entities) {
            return;
        }

        entities.forEach((e) => {
            var camera: Camera.Camera = e.get(Camera.Camera);

            switch (event.keyCode) {
                case Phaser.Keyboard.DOWN:
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
            EntityUtils.updateComponent(e, camera);
            EntityUtils.removeComponent(e, KeyboardInput);
        })


    }

    update(game: Phaser.Game, entity: Entity): void {


    }

}
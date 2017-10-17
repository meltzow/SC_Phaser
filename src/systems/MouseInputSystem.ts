import {BaseSystem} from "./BaseSystem";
import {KeyboardInput} from "../components/KeyboardInput";
import * as Camera from '../components/Camera'
import {EntityUtils} from "../entities/EntityUtils";
import {EventBus} from "../events/EventBus";
import {KeyInputEvent} from "../events/KeyInputEvent";
import {Entity} from "../entities/Entity";
import {MouseInput} from "../components/MouseInput";
import {Player} from "../components/Player";
import {MouseInputEvent, BUTTON} from "../events/MouseInputEvent";
import {MovePlayerEvent} from "../events/MovePlayerEvent"

export class MouseInputSystem extends BaseSystem {

    constructor() {
        super([MouseInput]);
        EventBus.subscribe(MouseInputEvent, (event: MouseInputEvent) => {
            this.handleMouseInputEvent(event);
        },)
    }

    handleMouseInputEvent(event: MouseInput) {
        var entities = EntityUtils.findEntities(Player);
        if (!entities) {
            return;
        }

        entities.forEach((e) => {
            switch (event.button) {
                case BUTTON.LEFT:
                    EventBus.post(new MovePlayerEvent({player: 0, target: new  Phaser.Plugin.Isometric.Point3(0,0,0) }))
                    break;
                case BUTTON.RIGHT:
                    EventBus.post(new MovePlayerEvent({player: 0, target: new  Phaser.Plugin.Isometric.Point3(10,10,0)}))
                    break;
                default:
                    break;
            }
//            EntityUtils.updateComponent(e, camera);
            EntityUtils.removeComponent(e, MovePlayerEvent);
        })


    }

    update(game: Phaser.Game, entity: Entity): void {


    }

}
import {BaseSystem} from "./BaseSystem";
import {EntityUtils} from "../entities/EntityUtils";
import {Motion} from "../components/Motion";
import {EventBus} from "../events/EventBus";
import {KeyInputEvent} from "../events/KeyInputEvent";
import {Player} from "../components/Player";
import {MovePlayerEvent} from "../events/MovePlayerEvent";

export class MotionSystem extends BaseSystem {

    constructor() {
        super([Motion]);
        EventBus.subscribe(KeyInputEvent, (event: KeyInputEvent) => {
               this.handleKeyInputEvent(event);
        }, )
    }

    create(game: Phaser.Game) {

    }

    handleKeyInputEvent = (event: KeyInputEvent) => {
        var playerList = EntityUtils.findEntities(Player);
        EventBus.post(new MovePlayerEvent({player: playerList[0].id, keyCode: Phaser.Keyboard.UP}));
    }


    update(game: Phaser.Game) {
        var entities = EntityUtils.findEntities(Motion);
        if (!entities) {
            return;
        }
        entities.forEach((ent) => {
            var overlords = game.world.filter((child) => {
                child.data && child.data.entity == ent.id
            })
            var overlord = overlords[0]
            if (!overlord) {
                return;
            }
            //if no key is pressed then stop else play walking animation
            if (overlord.body.velocity.y == 0 && overlord.body.velocity.x == 0) {
                overlord.animations.stop();
                overlord.animations.currentAnim.frame = 0;
            } else {
                if (overlord.animations.currentAnim.name != overlord.facing) {
                    overlord.animations.play(overlord.facing);
                }
            }

        })
    }
}
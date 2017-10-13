import {BaseSystem} from "./BaseSystem";
import {EntityUtils} from "../entities/EntityUtils";
import {Motion} from "../components/Motion";

export class MotionSystem extends BaseSystem {

    constructor() {
        super([Motion]);
        EventBus.subscribe((event: KeyInputEvent) => {

        })
    }

    create(game: Phaser.Game) {

    }

    update(game: Phaser.Game) {
        var entities = EntityUtils.findEntities(Motion);
        console.log("motionsystem is called with", entities)
        entities.forEach((ent) => {
            var overlords = game.world.filter((child) => {
                child.data && child.data.entity == ent.id
            })
            var overlord = overlords[0]
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
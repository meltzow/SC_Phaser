import {BaseSystem} from "./BaseSystem";
import {EntityUtils} from "../entities/EntityUtils";
import {EventBus} from "../events/EventBus";
import {Player} from "../components/Player";
import {MovePlayerEvent} from "../events/MovePlayerEvent";
import {Entity} from "../entities/Entity";
import * as easystarjs from 'easystarjs'
import {Moveable} from "../components/Moveable";
import {Position} from "../components/Position";


export class MotionSystem extends BaseSystem {

    levelData = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

    constructor() {
        super([Position, Moveable]);
        EventBus.subscribe(MovePlayerEvent, (event: MovePlayerEvent) => {
            this.handleMovePlayerEvent(event);
        },)
    }

    handleMovePlayerEvent = (event: MovePlayerEvent) => {
        var playerList = EntityUtils.findEntities(Player);
        if (playerList) {
            //TODO: check for event.player
            playerList[0].addComponent(new Moveable({target: event.target}))
        }
    }

    onEntityEachTick(game: Phaser.Game, entity: Entity) {

        var overlords = game.world.filter((child) => {
            child.data && child.data.entity == entity.id
        })
        game.world.forEach((child) => {
            child.children
            console.log(child);

        }, {})
        var overlord = overlords[0]
        if (!overlord) {
            return;
        }

        var position = entity.get(Position)
        var moveable = entity.get(Moveable);

        var easystar = new easystarjs.js();

        easystar.setGrid(this.levelData);
        easystar.setAcceptableTiles([0]);// Update the cursor position.
        easystar.enableDiagonals();
        easystar.findPath(position.x, position.y, moveable.target.x, moveable.target.y, (path) => {
            if (path === null) {
                alert("Path was not found.");
            } else {
                alert("Path was found. The first Point is " + path[0].x + " " + path[0].y);
            }
        })
        easystar.calculate();
        //if no key is pressed then stop else play walking animation
        if (overlord.body.velocity.y == 0 && overlord.body.velocity.x == 0) {
            overlord.animations.stop();
            overlord.animations.currentAnim.frame = 0;
        } else {
            if (overlord.animations.currentAnim.name != overlord.facing) {
                overlord.animations.play(overlord.facing);
            }
        }
    }
}
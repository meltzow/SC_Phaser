import {BaseSystem} from "./BaseSystem";
import {Entity} from "../entities/Entity";
import * as easystarjs from 'easystarjs'
import {Moveable} from "../components/Moveable";
import {Position} from "../components/Position";
import {GoToCommand} from "../components/commands/GoToCommand";
import {EntityUtils} from "../entities/EntityUtils";
import {Map} from '../components/Map'
import IsoSprite = Phaser.Plugin.Isometric.IsoSprite;
import Sprite = Phaser.Sprite;


export class MotionSystem extends BaseSystem {

    constructor() {
        super([Position, Moveable]);
    }

    onEntityUpdated(game: Phaser.Game, entity: Entity) {

        var goto = entity.get(GoToCommand);
        if (!goto) {
            return;
        }



        var overlords = game.world.filter((child) => {
            return child.data && child.data.entity == entity.id
        })
        var overlord:IsoSprite = overlords.list[0]
        if (!overlord) {
            return;
        }

        var position = entity.get(Position)

        if (position.x == goto.x && position.y == goto.y) {
            return;
        }

        // FIXME: tile size hardcoded 38
        overlord.isoPosition.setTo(Math.round(position.x * 38), Math.round(position.y * 38), position.z)
        var moveable = entity.get(Moveable);
        var easystar = new easystarjs.js();

        var map = EntityUtils.findEntity(Map);

        easystar.setGrid(map.get(Map).data);
        easystar.setAcceptableTiles([0]);// Update the cursor position.
        easystar.enableDiagonals();
        easystar.findPath(position.x, position.y, goto.x, goto.y, (path) => {
            if (path === null) {
                alert("Path was not found.");
            } else {
                if (path.length == 0) {
                    return
                }
                position.x = path[1].x
                position.y = path[1].y
                console.log("update overlord to position ", position)
                EntityUtils.updateComponent(entity, position)
            }
        })
        easystar.calculate();
        //if no key is pressed then stop else play walking animationevent
        if (overlord.body.velocity.y == 0 && overlord.body.velocity.x == 0) {
            overlord.animations.stop();
            if (overlord.animations.currentAnim) {
                overlord.animations.currentAnim.frame = 0;
            }
        } else {
            if (overlord.animations.currentAnim.name != (overlord as any).facing) {
                overlord.animations.play((overlord as any).facing);
            }
        }
    }
}
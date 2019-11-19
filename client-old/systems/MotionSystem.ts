import {BaseSystem} from "./BaseSystem";
import {Entity} from "../entities/Entity";
import {Moveable} from "../components/Moveable";
import {Position} from "../components/Position";
import {GoToCommand} from "../components/commands/GoToCommand";
import {EntityUtils} from "../entities/EntityUtils";
import {Map} from '../components/Map'
import IsoSprite = Phaser.Plugin.Isometric.IsoSprite;
import Sprite = Phaser.Sprite;
import * as pathfind from 'js-pathfind';

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
        var overlord: IsoSprite = overlords.list[0]
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

        var map = EntityUtils.findEntity(Map);

        var mapData = map.get(Map).data
        var path = pathfind([position.x, position.y], [goto.x, goto.y], mapData);

        if (!path || path.length == 2) {
            console.log("path not found")
        } else {
            position.x = path[1][0]
            position.y = path[1][1]
            console.log("update overlord to position ", position)
            EntityUtils.updateComponent(entity, position)
        }
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
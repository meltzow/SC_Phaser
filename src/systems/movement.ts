import {
    defineSystem,
    defineQuery,
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Rotation, {Direction} from '../components/Rotation'
import Input from '../components/Input'
import Level from "../components/Level";
import Phaser from "phaser";
import {EventDispatcher} from "../events/EventDispatcher";
import MouseClickedEvent from "../events/MouseClickedEvent";
import {GameStatus} from "../components/Game";
import {UnitStatus} from "../components/Unit";
import PathFinder from "phaser3-rex-plugins/plugins/board/pathfinder/PathFinder";

export function preloadMovementSystem(scene: Phaser.Scene) {
    // scene.load.scenePlugin('rexboardplugin',
    //     'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js',
    //     'rexBoard',
    //     'rexBoard');

}



export default function createMovementSystem(game: Phaser.Game, scene: Phaser.Scene) {
    //Private variables
    // const id = 'unit:' + playerId + ":" + nextUnitId;
    // nextUnitId++;

    // var game = Global.game;
    // var level = Global.level;
    // const pathfinder = game.plugins.add(Phaser.Plugins.PathFinderPlugin);

    let sprite: Phaser.GameObjects.Sprite;

    //  PATHFINDING

    let previousPath: never[] = []; // to remove debug
    let endPathCallback: () => void;
    let blocked;  // to avoid making 2 requests at pathfinding

    let status = UnitStatus.idle
    let actionTimer: { stop: () => void };
    let attackingEnemy;

    // const life = MAX_LIFE;
    let lifeRect, lifeRectBackground;

    // let collectingResource;
    // const resourceAmount = 0;
    //
    // let building;

    const direction = "down";
    let overrideMove = false;

    const movementQuery = defineQuery([Position, Velocity, Rotation])
    const levelQuery = defineQuery([Level])

    let pathFinder: PathFinder

    // --------------------
// RESOURCE COLLECTION
// ------------------
    function doNotMove() {
        overrideMove = true;
        scene.time.addEvent({
            delay: 1000, callback: function () {
                overrideMove = false;
            }
        })
    }

// ---------------------------
// MOVEMENT
// -----------------------------
//     function moveTo(path: number | { y: any }[] | void[]) {
//         const tileSize = Global.map.tileWidth;
//
//         const x = path[0].x * tileSize;
//         const y = path[0].y * tileSize;
//         //console.log("Moving sprite from " + sprite.x+"x"+ sprite.y+ " to "+x+"x"+ y );
//         scene.physics.moveTo(sprite, x, y, SPEED);
//         sprite.animations.play('walk-' + direction);
//         status = UnitStatus.walking
//
//         // If we reached the properties, we remove from the path and keep going
//         if (Math.abs(sprite.x - x) < tileSize / 2 && Math.abs(y - sprite.y) < tileSize / 2) {
//             level.debugTile(path[0].x, path[0].y, false);
//             path.shift(); //previousPath.splice(0,1 );
//             setDirection(path);
//         }
//
//         // Reached end path
//         if (path.length === 0) {
//             //console.log("Reached end path "+ x +"x"+ y);
//             sprite.body.velocity.x = 0;
//             sprite.body.velocity.y = 0;
//             status = UnitStatus.idle
//             sprite.anims.play('stand');
//
//             if (endPathCallback) endPathCallback();
//         }
//     }

    const create = () => {

        EventDispatcher.getInstance().on(MouseClickedEvent.name, (ctx: MouseClickedEvent) => {
            console.log(ctx)
            const tileXYArray = pathFinder.findPath({x: ctx.x, y: ctx.y});
            console.log("weg:" + tileXYArray)
        })


        const config = {
            // occupiedTest: false,
            // blockerTest: false,

            // ** cost **
            // cost: 1,   // constant cost
            // costCallback: undefined,
            // costCallbackScope: undefined,
            // cacheCost: true,

            // pathMode: 10,  // A*
            // weight: 10,   // weight for A* searching mode
            // shuffleNeighbors: false,
        }
        pathFinder = new PathFinder(config);

        // Pathfinding creation
        // pathfinder.setGrid(Global.map.layers[0].data, Global.walkables);
        // pathfinder._easyStar.enableDiagonals();

        /*  var bmd = game.make.bitmapData();
          bmd.load('player');
          //bmd.key = 'stand/001.png';
          bmd.replaceRGB(255,255,255, 255, 250, 0, 0, 255);
*/
        //sprite = game.add.sprite(x, y, bmd);
        //console.log("sprite.animations._frameData" , sprite.animations._frameData);
        //TODO FIx bitmap with animations
        //  sprite.frameName = 'stand/001.png';
        //var frameNames = Phaser.Animation.generateFrameNames('stand/', 1, 1, '.png', 3);

        // switch (type) {
        //     case 0:
        //         sprite = scene.add.sprite(x, y, 'player');
                // break;
            // case 1:
            //     sprite = scene.add.sprite(x, y, 'enemy');
            //     break;
            // case 2:
            //     sprite = scene.add.sprite(x, y, 'enemy2');
            //     break;
        // }

        // sprite.setOrigin(0.5, 0.5)

        // sprite.anims.create({
        //     key: 'stand'
        //     , frames: sprite.anims.generateFrameNames('stand/', {start: 1, end: 1, '.png', 3), 10, true, false})
        //     });
        // sprite.animations.add('attack', Phaser.Animation.generateFrameNames('attack/', 1, 5, '.png', 3), 10, true, false);
        // sprite.animations.add('walk-down', Phaser.Animation.generateFrameNames('walk/down/', 1, 6, '.png', 3), 10, true, false);
        // sprite.animations.add('walk-left', Phaser.Animation.generateFrameNames('walk/left/', 1, 6, '.png', 3), 10, true, false);
        // sprite.animations.add('walk-up', Phaser.Animation.generateFrameNames('walk/up/', 1, 6, '.png', 3), 10, true, false);
        // sprite.animations.add('walk-right', Phaser.Animation.generateFrameNames('walk/right/', 1, 6, '.png', 3), 10, true, false);

        //console.log("animations " , sprite.animations);
        //  console.log("animations " , sprite.animations.frames);

        //  sprite.currentFrame = sprite.animations.currentAnim;
        // sprite.animations.play('stand');
        // Utils.tintSprite(sprite, playerId);

        // scene.physics.enable(sprite, Phaser.Physics.ARCADE)
        //
        // actionTimer = scene.time.create(false);
        //
        // lifeRect = new Phaser.Rectangle(sprite.x, sprite.bottom, sprite.width, 10);
        // // Red background for life, set to width 0 on start
        // lifeRectBackground = new Phaser.Rectangle(sprite.right, sprite.bottom, 0, 10);
        //
        // scene.time.events.loop(100, closestEnemyUnit); //Efficient AI method (don't need update)
    }

    create()


    return defineSystem((world) => {
        const entities = movementQuery(world)
        const lqEnt = levelQuery(world)

        for (let i = 0; i < entities.length; ++i) {
            const id = entities[i]

            const direction = Rotation.direction[id]
            //TODO
            const speed = 5

            switch (direction) {
                case Direction.None:
                    Velocity.x[id] = 0
                    Velocity.y[id] = 0
                    break

                case Direction.Left:
                    Velocity.x[id] = -speed
                    Velocity.y[id] = 0
                    Rotation.angle[id] = 180
                    break

                case Direction.Right:
                    Velocity.x[id] = speed
                    Velocity.y[id] = 0
                    Rotation.angle[id] = 0
                    break

                case Direction.Up:
                    Velocity.x[id] = 0
                    Velocity.y[id] = -speed
                    Rotation.angle[id] = 270
                    break

                case Direction.Down:
                    Velocity.x[id] = 0
                    Velocity.y[id] = speed
                    Rotation.angle[id] = 90
                    break
            }

            Position.x[id] += Velocity.x[id]
            Position.y[id] += Velocity.y[id]
        }

        return world
    })
}

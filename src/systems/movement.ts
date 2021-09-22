import {
    defineSystem,
    defineQuery, enterQuery,
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Rotation, {Direction} from '../components/Rotation'
import Phaser from "phaser";
import Tilemap = Phaser.Tilemaps.Tilemap;
import {
    Board,
    Shape,
    MoveTo, PathFinder
} from "phaser3-rex-plugins/plugins/board-components";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Speed from "../components/Speed";
import Sprite from "../components/Sprite";
import Commandable from "../components/Commandable";
import {Command, CommandType} from "../components/commands/Command";

const COLOR_LIGHT = 0x76d275;

export function preloadMovementSystem(scene: Phaser.Scene) {
    scene.load.atlas('player', 'assets/img/link-white.png', 'assets/img/zelda32.json');
    scene.load.atlas('enemy', 'assets/img/enemy-white.png', 'assets/img/enemy.json');
    scene.load.atlas('enemy2', 'assets/img/enemy2.png', 'assets/img/enemy2.json');
    scene.load.scenePlugin({
        key: 'rexboardplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js',
        sceneKey: 'rexBoard'
    });
}


export default function createMovementSystem(game: Phaser.Game, scene: Phaser.Scene, map: Tilemap, groundLayer: Phaser.Tilemaps.TilemapLayer, rexBoard: BoardPlugin, references: {board: Board, spriteMap: Map<number, Phaser.GameObjects.Sprite>}) {
    let actionTimer: { stop: () => void };
    let attackingEnemy;

    // const life = MAX_LIFE;
    let lifeRect, lifeRectBackground;

    // let collectingResource;
    // const resourceAmount = 0;
    //
    // let building;

    const movementQuery = defineQuery([Position, Velocity, Rotation, Speed, Sprite, Commandable])

    // const spriteQueryEnter = enterQuery(movementQuery)

    const create = () => {
        references.board = rexBoard.add.board({
            grid: {
                gridType: 'quadGrid',
                x: 0,
                y: 0,
                cellWidth: map.tileWidth,
                cellHeight: map.tileHeight,
                type: 'orthogonal'
            },
            width: map.width,
            height: map.height,
            // wrap: false,
            // infinity: false,
        })


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

        for (let i = 0; i < entities.length; ++i) {
            const id = entities[i]

            const direction = Rotation.direction[id]
            const speed = Speed.value[id]


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

            const tileX = map.worldToTileX(Position.x[id] + Velocity.x[id])
            if (tileX > 0 && tileX < map.width) {
                Position.x[id] += Velocity.x[id]
            }
            Position.y[id] += Velocity.y[id]
            const tileY = map.worldToTileY(Position.y[id] + Velocity.y[id])
            if (tileY > 0 && tileY < map.height) {
                Position.y[id] += Velocity.y[id]
            }
            const sprite = references.spriteMap.get(id)
            if (sprite) {
            const cmdId = Commandable.commands[id][0]
                if (cmdId != null) {
                    if (Command.type[cmdId] == CommandType.GOTO) {
                        const tileXY = references.board.worldXYToTileXY(Command.targetX[cmdId], Command.targetY[cmdId])
                        const moveTo = rexBoard.add.moveTo(sprite, {
                            // speed: 400,
                            // rotateToTarget: false,
                            occupiedTest: true,
                            // blockerTest: false,
                            // sneak: false,
                        })
                        moveTo.moveCloser(tileXY.x, tileXY.y)
                        Position.x[id] = sprite.x
                        Position.y[id] = sprite.y
                        if (Command.targetX[cmdId] == sprite.x && Command.targetY[cmdId] == sprite.y) {
                            Command.type[cmdId] = CommandType.NONE
                        }
                    }
                }

            }
        }

        return world
    })
}

import {
    defineSystem,
    defineQuery, enterQuery,
} from 'bitecs'

import Position from '../components/Position'
import Velocity from '../components/Velocity'
import Rotation, {Direction} from '../components/Rotation'
import Level from "../components/Level";
import Phaser from "phaser";
import {EventDispatcher} from "../events/EventDispatcher";
import MouseClickedEvent from "../events/MouseClickedEvent";
import Tilemap = Phaser.Tilemaps.Tilemap;
import {
    Board,
    QuadGrid, HexagonGrid,
    Shape,
    MoveTo, PathFinder
} from "phaser3-rex-plugins/plugins/board-components";
import {TileXYType} from 'phaser3-rex-plugins/plugins/board/types/Position';
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Speed from "../components/Speed";
import Sprite from "../components/Sprite";

const COLOR_LIGHT = 0x76d275;

export class BottomChess extends Shape {
    moveTo: MoveTo
    public pathFinder: PathFinder

    constructor(
        board: Board,
        tileXY: { x: number, y: number }
    ) {

        const scene = board.scene;
        // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
        super(board, tileXY.x, tileXY.y, 0, COLOR_LIGHT);
        scene.add.existing(this);
        this.setDepth(1);

        // add behaviors
        this.moveTo = new MoveTo(this);
        this.pathFinder = new PathFinder(this, {
            occupiedTest: true
        });
    }

    moveToTile(endTile): boolean {
        if (this.moveTo.isRunning) {
            return false;
        }
        const tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
        this.moveAlongPath(tileXYArray);
        return true;
    }

    moveAlongPath(path: PathFinder.NodeType[]) {
        if (path.length === 0) {
            // this.showMoveableArea();
            return;
        }

        this.moveTo.once('complete', () => {
            this.moveAlongPath(path);
        }, this);
        this.moveTo.moveTo(path.shift());
        return this;
    }
}

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

    const movementQuery = defineQuery([Position, Velocity, Rotation, Speed, Sprite])

    const spriteQueryEnter = enterQuery(movementQuery)

    const create = () => {
        references.board = rexBoard.add.board({
            grid: {
                gridType: 'quadGrid',
                x: 0,
                y: 0,
                cellWidth: map.tileWidth,
                cellHeight: map.tileHeight,
                type: 'orthogonal'// 'orthogonal'|'isometric'
            },
            width: map.width,
            height: map.height,
            // wrap: false,
            // infinity: false,
        })


        // add chess
        // const chessA = new MyChess(board, {x: 5,y: 5});
        // chessA.showMoveableArea();
        // const tileXYArray = chessA.pathFinder.findPath({x: 7, y:10})
        // console.log("weg:" + tileXYArray)

        // board.addChess(sprite, 0, 0, 0)


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

            // references.board.addChess(chessA, tileXY.x, tileXY.y, 0)
            // EventDispatcher.getInstance().on(MouseClickedEvent.name, (ctx: MouseClickedEvent) => {
            //     console.log(ctx)
            //     // const tile = groundLayer.getTileAtWorldXY(ctx.x, ctx.y)
            //     // // var xy = worldToTile(ctx.x, ctx.y);
            //     // console.log("tile:[" + tile.x + "," + tile.y + "]")
            //     // chessA.moveToTile(tile)
            //     const tileXYZ = references.board.worldXYToTileXY(ctx.x, ctx.y)
            //     // @ts-ignore
            //     const tileXYArray = chessA.pathFinder.findPath(tileXYZ)
            //     // @ts-ignore
            //     chessA.moveAlongPath(tileXYArray)
            //     console.log("weg:" + tileXYArray)
            // })
        // }

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

                var moveTo = scene.rexBoard.add.moveTo(sprite, {
                    // speed: 400,
                    // rotateToTarget: false,
                    // occupiedTest: false,
                    // blockerTest: false,
                    // sneak: false,
                })
                moveTo.moveCloser(tileX, tileY);
            }
        }

        return world
    })
}

import { System } from "@colyseus/ecs";
import {Position} from "../../shared/components/Position";
import {Velocity} from "../../shared/components/Velocity";
import {Rotation, Direction} from "../../shared/components/Rotation";
import {Speed} from "../../shared/components/Speed";
import {Sprite} from "../../shared/components/Sprite";
import {Commandable} from "../../shared/components/Commandable";
import Phaser from "phaser";
import {Room} from "colyseus.js";
import Tilemap = Phaser.Tilemaps.Tilemap;
import {Board} from "phaser3-rex-plugins/plugins/board-components";
import {CommandType} from "../../shared/components/commands/Command";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";

export function getMovementSystem(map: Tilemap,rexBoard: BoardPlugin, references: {board: Board, spriteMap: Map<number, Phaser.GameObjects.Sprite>}) {

    return class MovementSystem extends System {
        static queries = {
            entities: {
                components: [Position, Velocity
                    , Rotation, Speed, Sprite, Commandable]
            },
        };

        init() {
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
        }

        execute(delta: number) {

            const entities = this.queries.entities.results;
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                const rotation = entity.getMutableComponent(Rotation)
                const direction = rotation?.direction;
                const speed = entity.getMutableComponent(Speed)?.value;
                const velocity = entity.getMutableComponent(Velocity)
                const position = entity.getMutableComponent(Position)
                const commandable = entity.getMutableComponent(Commandable)

                switch (direction) {
                    case Direction.None:
                        velocity!.x = 0
                        velocity!.y = 0
                        break

                    case Direction.Left:
                        velocity!.x = -speed!
                        velocity!.y = 0
                        rotation!.angle = 180
                        break

                    case Direction.Right:
                        velocity!.x = speed
                        velocity!.y = 0
                        rotation!.angle = 0
                        break

                    case Direction.Up:
                        velocity!.x = 0
                        velocity!.y = -speed!
                        rotation!.angle = 270
                        break

                    case Direction.Down:
                        velocity!.x = 0
                        velocity!.y = speed
                        rotation!.angle = 90
                        break
                }

                const tileX = map.worldToTileX(position!.x! + velocity!.x!)
                if (tileX > 0 && tileX < map.width) {
                    position!.x! += velocity!.x!
                }
                position!.y! += velocity!.y!
                const tileY = map.worldToTileY(position!.y! + velocity!.y!)
                if (tileY > 0 && tileY < map.height) {
                    position!.y! += velocity!.y!
                }
                const sprite = references.spriteMap.get(i)
                if (sprite) {
                    const command = commandable!.commands[0]
                    if (command != null) {
                        if (command.type == CommandType.GOTO) {
                            const tileXY = references.board.worldXYToTileXY(command!.targetX!, command!.targetY!)
                            const moveTo = rexBoard.add.moveTo(sprite, {
                                // speed: 400,
                                // rotateToTarget: false,
                                occupiedTest: true,
                                // blockerTest: false,
                                // sneak: false,
                            })
                            moveTo.moveCloser(tileXY.x, tileXY.y)
                            position!.x = sprite.x
                            position!.y = sprite.y
                            if (command.targetX == sprite.x && command.targetY == sprite.y) {
                                command.type = CommandType.NONE
                            }
                        }
                    }

                }
            }
        }
    }
}


// export class Renderer extends System {
//   execute() {
//     var context = this.queries.context.results[0];
//     let canvasComponent = context.getComponent(CanvasContext);
//     let ctx = canvasComponent.ctx;
//     let canvasWidth = canvasComponent.width;
//     let canvasHeight = canvasComponent.height;

//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//     let circles = this.queries.circles.results;
//     for (var i = 0; i < circles.length; i++) {
//       let circle = circles[i].getComponent(Circle);

//       ctx.beginPath();
//       ctx.arc(
//         circle.position.x,
//         circle.position.y,
//         circle.radius,
//         0,
//         2 * Math.PI,
//         false
//       );
//       ctx.lineWidth = 1;
//       ctx.strokeStyle = "#fff";
//       ctx.stroke();
//     }

//     let intersectingCircles = this.queries.intersectingCircles.results;
//     for (let i = 0; i < intersectingCircles.length; i++) {
//       let intersect = intersectingCircles[i].getComponent(Intersecting);
//       for (var j = 0; j < intersect.points.length; j++) {
//         var points = intersect.points[j];
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = "#ff9";

//         ctx.fillStyle = "rgba(255, 255,255, 0.2)";
//         fillCircle(ctx, points[0], points[1], 8);
//         fillCircle(ctx, points[2], points[3], 8);

//         ctx.fillStyle = "#fff";
//         fillCircle(ctx, points[0], points[1], 3);
//         fillCircle(ctx, points[2], points[3], 3);

//         drawLine(ctx, points[0], points[1], points[2], points[3]);
//       }
//     }
//   }
// }

// Renderer.queries = {
//   circles: { components: [Circle] },
//   intersectingCircles: { components: [Intersecting] },
//   context: { components: [CanvasContext], mandatory: true }
// };

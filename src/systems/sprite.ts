import Phaser from 'phaser'
import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld
} from 'bitecs'

import Position from '../components/Position'
import Sprite from '../components/Sprite'
import Rotation from '../components/Rotation'
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/Board";

export function preloadSpriteSystem(scene: Phaser.Scene) {
    scene.load.image('tank-blue', 'assets/tank_blue.png')
    scene.load.image('tank-green', 'assets/tank_green.png')
    scene.load.image('tank-red', 'assets/tank_red.png')
    scene.load.image('link', 'assets/animations/link/stand/001.png')

}

export default function createSpriteSystem(scene: Phaser.Scene, textures: string[], spritesById: Map<number, Phaser.GameObjects.Sprite>, board: Board) {

    const spriteQuery = defineQuery([Position, Rotation, Sprite])

    const spriteQueryEnter = enterQuery(spriteQuery)
    const spriteQueryExit = exitQuery(spriteQuery)

    return defineSystem((world: IWorld) => {
        const entitiesEntered = spriteQueryEnter(world)
        for (let i = 0; i < entitiesEntered.length; ++i) {
            const id = entitiesEntered[i]
            const texId = Sprite.texture[id]
            const texture = textures[texId]
            const sprite = scene.add.sprite(Position.x[id], Position.y[id], texture)
            spritesById.set(id, sprite)
            const tileXY = board.worldXYToTileXY(Position.x[id], Position.y[id])
            // var chessData = sprite.rexChess;
            board.addChess(sprite, tileXY.x, tileXY.y, 0);
            (sprite as any).rexChess.setBlocker()
        }

        const entities = spriteQuery(world)
        for (let i = 0; i < entities.length; ++i) {
            const id = entities[i]

            const sprite = spritesById.get(id)
            if (!sprite) {
                // log an error
                continue
            }

            sprite.x = Position.x[id]
            sprite.y = Position.y[id]
            sprite.angle = Rotation.angle[id]
        }

        const entitiesExited = spriteQueryExit(world)
        for (let i = 0; i < entitiesExited.length; ++i) {
            const id = entitiesEntered[i]
            spritesById.delete(id)
        }

        return world
    })
}

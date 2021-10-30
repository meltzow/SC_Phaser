import Phaser from 'phaser'
import {Position} from "../../../common/components/Position";
import {Rotation} from "../../../common/components/Rotation";
import {Sprite} from "../../../common/components/Sprite";
import {System} from "@colyseus/ecs";

export function preloadSpriteSystem(scene: Phaser.Scene) {
    scene.load.image('tank-blue', 'assets/tank_blue.png')
    scene.load.image('tank-green', 'assets/tank_green.png')
    scene.load.image('tank-red', 'assets/tank_red.png')
    scene.load.image('link', 'assets/animations/link/stand/001.png')

}

export default function createSpriteSystem(scene: Phaser.Scene, textures: string[], spritesById: Map<number, Phaser.GameObjects.Sprite>) {
    console.log("create SpriteSystem")
    return class SpriteSystem extends System {

        static queries = {
            sprites: {
                components: [Position, Rotation, Sprite],
                listen: {
                    added: true,
                    removed: true,
                    changed: true  // Detect that any of the components on the query (Box, Transform) has changed
                }
            }
        }

        execute(delta: number, time: number): void {
            if (this.queries.sprites.added.length) {
                const entitiesEntered = this.queries.sprites.added
                for (let i = 0; i < entitiesEntered.length; ++i) {
                    const ent = entitiesEntered[i]
                    const spriteComp = ent.getComponent(Sprite)
                    const texId = spriteComp!.texture
                    const texture = textures[texId!]
                    // const position = ent.getComponent(Position)
                    // const sprite = scene.add.sprite(position!.x!, position!.y!, texture)
                    const sprite = scene.add.sprite(100, 100, texture)
                    spritesById.set(ent.id, sprite)
                }
            }

            if (this.queries.sprites.changed.length) {
                const entities = this.queries.sprites.changed
                for (let i = 0; i < entities.length; ++i) {
                    const id = entities[i]

                    const sprite = spritesById.get(id.id)
                    if (!sprite) {
                        // log an error
                        continue
                    }

                    sprite.x = id.getComponent(Position)!.x!
                    sprite.y = id.getComponent(Position)!.y!
                    sprite.angle = id.getComponent(Rotation)!.angle!
                }
            }
            if (this.queries.sprites.removed.length) {
                const entitiesExited = this.queries.sprites.removed
                for (let i = 0; i < entitiesExited.length; ++i) {
                    const id = entitiesExited[i]
                    spritesById.delete(id.id)
                }
            }
        }
    }

}

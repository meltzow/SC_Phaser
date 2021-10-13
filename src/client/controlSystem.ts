import Phaser, {Game, Scene} from 'phaser'

import FixedKeyControl = Phaser.Cameras.Controls.FixedKeyControl;
import {System} from "@colyseus/ecs";
import {InputComponent} from "../shared/components/InputComponent";
import {Player} from "../shared/components/Player";

export function getControlSystem(scene: Scene, game: Game) {

    return class ControlSystem extends System {

        static queries = {
            input: { components: [InputComponent]},
        }

        controls: FixedKeyControl | undefined
        inputState: InputComponent | undefined

        init() {
            const cursors = scene.input.keyboard.createCursorKeys();
            const controlConfig = {
                camera: scene.cameras.main,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                speed: 0.5,
                zoomIn: scene.input.keyboard.addKey('A'),
                zoomOut: scene.input.keyboard.addKey('Q')
            };

            this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
            const that = this
            scene.input.on("pointerdown", () => {
                this.inputState =  new InputComponent()
                this.inputState.mouseX = game.input.activePointer.worldX
                this.inputState.mouseY = game.input.activePointer.worldY
                console.log("client clicked @ [" + this.inputState.mouseX + "," + this.inputState.mouseY + "]")
            })
        }

        execute(delta: number, time: number): void {

            if (this.inputState) {
                this.queries.input.results.forEach(entity => {
                    let playerEnt = entity
                    let inputComp = playerEnt.getMutableComponent(InputComponent)
                    inputComp!.mouseX = game.input.activePointer.worldX
                    inputComp!.mouseY = game.input.activePointer.worldY
                    console.log("client clicked @ [" + inputComp!.mouseX + "," + inputComp!.mouseY + "]")
                })
            }



            // @ts-ignore
            if (this.queries.input.changed) {
                const context = this.queries.input.changed[0]
                let inputComponent = context.getMutableComponent(InputComponent);
            }


            this.controls!.update(delta)
        }

        // inputDown() {
        //     let playerEnt = ControlSystem.queries.player.results[0]
        //     let inputComp = playerEnt.getMutableComponent(InputComponent)
        //     inputComp!.mouseX = game.input.activePointer.worldX
        //     inputComp!.mouseY = game.input.activePointer.worldY
        // }
    }
}
